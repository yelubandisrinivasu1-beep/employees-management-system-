"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const getMongoUri = () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("Missing MONGO_URI in environment. Check backend/.env and ensure dotenv is loading.");
    }
    return uri.replace(/^\"(.*)\"$/, "$1");
};
const maskUri = (uri) => {
    return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.*)/, "$1*****$3");
};
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(getMongoUri());
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        console.error("MongoDB URI:", maskUri(getMongoUri()));
        console.error("If this is an Atlas URI, verify DNS/SRV connectivity and that your IP is allowed in Atlas network access.");
        process.exit(1);
    }
};
exports.default = connectDB;
