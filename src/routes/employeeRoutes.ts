import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
} from "../controllers/employeeContoller";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", protect, authorize("admin", "manager"), createEmployee);
router.get("/", protect, authorize("admin", "manager", "technical_manager"), getAllEmployees);
router.get("/:id", protect, authorize("admin", "manager", "technical_manager", "employee"), getEmployeeById);
router.delete("/:id", protect, authorize("admin", "manager"), deleteEmployee);

export default router;