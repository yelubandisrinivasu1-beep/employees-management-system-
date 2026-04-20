import express from "express";
import {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  updateTaskReply,
  getTechnicalManagerTasks,
  updateTask,
  addTaskComment,
} from "../controllers/taskController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", protect, authorize("technical_manager", "admin"), createTask);
router.get("/", protect, authorize("admin", "manager"), getAllTasks);
router.get("/my-tasks", protect, authorize("employee"), getMyTasks);
router.patch("/:id/status", protect, authorize("employee"), updateTaskStatus);
router.patch("/:id/reply", protect, authorize("employee"), updateTaskReply);
router.get("/technical-manager", protect, authorize("technical_manager", "admin"), getTechnicalManagerTasks);
router.put("/:id", protect, authorize("technical_manager", "admin", "manager"), updateTask);
router.post("/:id/comments", protect, addTaskComment);

export default router;