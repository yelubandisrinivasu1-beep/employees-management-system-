import express from "express";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", protect, authorize("admin", "manager"), createDepartment);
router.get("/", protect, getDepartments);
router.get("/:id", protect, getDepartmentById);
router.put("/:id", protect, authorize("admin"), updateDepartment);
router.delete("/:id", protect, authorize("admin"), deleteDepartment);

export default router;
