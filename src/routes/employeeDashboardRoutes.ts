import express from "express";
import { getEmployeeDashboard } from "../controllers/employeeDashboardController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/", protect, authorize("employee"), getEmployeeDashboard);

export default router;