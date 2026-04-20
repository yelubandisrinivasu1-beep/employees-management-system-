"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAuthLogs = exports.getAuthLogs = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const authLogModel_1 = __importDefault(require("../models/authLogModel"));
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
            return;
        }
        const existingUser = await userModel_1.default.findOne({
            email: email.toLowerCase(),
        });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists",
            });
            return;
        }
        const user = new userModel_1.default({
            name,
            email: email.toLowerCase(),
            password,
            role,
        });
        await user.save();
        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
            return;
        }
        const user = await userModel_1.default.findOne({
            email: email.toLowerCase(),
        });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        // Create Login Audit Record
        await authLogModel_1.default.create({
            user: user._id,
            action: "login",
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers["user-agent"],
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res) => {
    var _a, _b;
    try {
        // AuthRequest attaches req.user
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (userId) {
            await authLogModel_1.default.create({
                user: userId,
                action: "logoff",
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.headers["user-agent"],
            });
        }
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.logoutUser = logoutUser;
const getAuthLogs = async (req, res) => {
    try {
        const logs = await authLogModel_1.default.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .limit(100);
        res.status(200).json({
            success: true,
            data: logs,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getAuthLogs = getAuthLogs;
const getMyAuthLogs = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const logs = await authLogModel_1.default.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json({
            success: true,
            data: logs,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getMyAuthLogs = getMyAuthLogs;
