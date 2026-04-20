import express from "express";
import {
  markAttendance,
  getEmployeeAttendance,
  getMyAttendance,
  checkIn,
  checkOut,
} from "../controllers/attendanceController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/check-in", protect, authorize("employee"), checkIn);
router.post("/check-out", protect, authorize("employee"), checkOut);
router.post("/", protect, authorize("admin", "manager"), markAttendance);
router.get("/my-attendance", protect, authorize("employee"), getMyAttendance);
router.get("/:employeeId", protect, authorize("admin", "manager", "employee"), getEmployeeAttendance);

export default router;