import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Notification from "../models/notificationModel";

export const createNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, title, message, type } = req.body;

    const notification = await Notification.create({
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
  } catch (error: any) {
    console.error("Create Notification Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error: any) {
    console.error("Get Notifications Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ success: false, message: "Notification not found" });
      return;
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error: any) {
    console.error("Mark As Read Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error: any) {
    console.error("Mark All As Read Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      res.status(404).json({ success: false, message: "Notification not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error: any) {
    console.error("Delete Notification Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
