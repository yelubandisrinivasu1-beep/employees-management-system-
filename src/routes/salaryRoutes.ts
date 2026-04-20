import express from "express";
import {
  generateSalary,
  getEmployeeSalary,
} from "../controllers/salaryController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/generate", protect, authorize("admin", "manager", "technical_manager", "employee"), generateSalary);
router.get("/:employeeId", protect, authorize("admin", "manager", "employee"), getEmployeeSalary);

export default router;