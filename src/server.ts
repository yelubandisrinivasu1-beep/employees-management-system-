import path from "path";
import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
import { seedAll } from "./utils/seedAll";

const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../src/.env"),
];

const loadedEnv = envPaths.find((candidate) => {
  const result = dotenv.config({ path: candidate });
  return !result.error;
});

if (!loadedEnv) {
  console.warn(
    `No .env file found at ${envPaths.join(" or ")}. Please create a backend/.env file with MONGO_URI and other settings.`
  );
}

import http from "http";
import { Server } from "socket.io";
import Message from "./models/messageModel";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    await seedAll();

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    app.set("io", io);

    io.on("connection", (socket) => {
      console.log("User connected via socket:", socket.id);

      socket.on("join", (userId) => {
        socket.join(userId);
      });

      socket.on("private_message", async ({ senderId, receiverId, content }) => {
        try {
          const message = new Message({ senderId, receiverId, content });
          await message.save();
          // Emit to both sender and receiver
          io.to(receiverId).to(senderId).emit("new_message", message);
        } catch (error) {
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
  } catch (error) {
    console.error("Server startup failed:", error);
  }
};

startServer();