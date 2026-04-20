"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactList = exports.getConversationHistory = void 0;
const messageModel_1 = __importDefault(require("../models/messageModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const getConversationHistory = async (req, res) => {
    var _a, _b;
    try {
        const currentUserId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        const { otherUserId } = req.params;
        if (!currentUserId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const messages = await messageModel_1.default.find({
            $or: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId },
            ],
        }).sort({ createdAt: 1 });
        res.status(200).json({ success: true, data: messages });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};
exports.getConversationHistory = getConversationHistory;
const getContactList = async (req, res) => {
    var _a, _b, _c;
    try {
        const currentUserId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        const userRole = (_c = req.user) === null || _c === void 0 ? void 0 : _c.role;
        if (!currentUserId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        // A very basic contact list:
        // If Admin/Manager -> sees all users
        // If Tech Manager -> sees all users (or team)
        // If Employee -> sees all users
        // For simplicity, we just return a list of users minus the current user.
        const users = await userModel_1.default.find({ _id: { $ne: currentUserId } }).select("name email role isActive");
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};
exports.getContactList = getContactList;
