"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = exports.createNotification = void 0;
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const createNotification = async (req, res) => {
    try {
        const { userId, title, message, type } = req.body;
        const notification = await notificationModel_1.default.create({
            userId,
            title,
            message,
            type,
        });
        const io = req.app.get("io");
        if (io) {
            io.to(userId.toString()).emit("new_notification", notification);
        }
        res.status(201).json({ success: true, data: notification });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createNotification = createNotification;
const getNotifications = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        const notifications = await notificationModel_1.default.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const notification = await notificationModel_1.default.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!notification) {
            res.status(404).json({ success: false, message: "Notification not found" });
            return;
        }
        res.status(200).json({ success: true, data: notification });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        await notificationModel_1.default.updateMany({ userId, isRead: false }, { isRead: true });
        res.status(200).json({ success: true, message: "All notifications marked as read" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.markAllAsRead = markAllAsRead;
const deleteNotification = async (req, res) => {
    try {
        const notification = await notificationModel_1.default.findByIdAndDelete(req.params.id);
        if (!notification) {
            res.status(404).json({ success: false, message: "Notification not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Notification deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteNotification = deleteNotification;
