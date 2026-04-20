import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaveRequests,
  updateLeaveStatus,
} from "../controllers/leaveController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", protect, authorize("employee"), applyLeave);
router.get("/my-leaves", protect, authorize("employee"), getMyLeaves);
router.get("/", protect, authorize("manager", "admin"), getAllLeaveRequests);
router.patch("/:id/status", protect, authorize("manager", "admin"), updateLeaveStatus);

export default router;