import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/authMiddleware";
import Message from "../models/messageModel";
import User from "../models/userModel";

export const getConversationHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.userId || req.user?.id;
    const { otherUserId } = req.params;

    if (!currentUserId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

export const getContactList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.userId || req.user?.id;
    const userRole = req.user?.role;

    if (!currentUserId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    // A very basic contact list:
    // If Admin/Manager -> sees all users
    // If Tech Manager -> sees all users (or team)
    // If Employee -> sees all users
    // For simplicity, we just return a list of users minus the current user.
    const objectId = new mongoose.Types.ObjectId(currentUserId);
    const users = await User.find({ _id: { $ne: objectId } }).select("name email role isActive");

    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};
