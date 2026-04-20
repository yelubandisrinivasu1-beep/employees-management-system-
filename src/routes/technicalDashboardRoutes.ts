import express from "express";
import { getTechnicalManagerDashboard } from "../controllers/technicalDashboardController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/", protect, authorize("technical_manager", "admin"), getTechnicalManagerDashboard);

export default router;