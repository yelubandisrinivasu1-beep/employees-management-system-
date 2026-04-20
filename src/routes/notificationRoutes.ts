import express from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect, createNotification);
router.get("/", protect, getNotifications);
router.put("/mark-all-read", protect, markAllAsRead);
router.put("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

export default router;
