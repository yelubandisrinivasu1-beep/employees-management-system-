"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const seedAll_1 = require("./utils/seedAll");
const envPaths = [
    path_1.default.resolve(process.cwd(), ".env"),
    path_1.default.resolve(__dirname, "../src/.env"),
];
const loadedEnv = envPaths.find((candidate) => {
    const result = dotenv_1.default.config({ path: candidate });
    return !result.error;
});
if (!loadedEnv) {
    console.warn(`No .env file found at ${envPaths.join(" or ")}. Please create a backend/.env file with MONGO_URI and other settings.`);
}
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const messageModel_1 = __importDefault(require("./models/messageModel"));
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await (0, db_1.default)();
        await (0, seedAll_1.seedAll)();
        const server = http_1.default.createServer(app_1.default);
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        app_1.default.set("io", io);
        io.on("connection", (socket) => {
            console.log("User connected via socket:", socket.id);
            socket.on("join", (userId) => {
                socket.join(userId);
            });
            socket.on("private_message", async ({ senderId, receiverId, content }) => {
                try {
                    const message = new messageModel_1.default({ senderId, receiverId, content });
                    await message.save();
                    // Emit to both sender and receiver
                    io.to(receiverId).to(senderId).emit("new_message", message);
                }
                catch (error) {
                    console.error("Message save error:", error);
                }
            });
            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Server startup failed:", error);
    }
};
startServer();
