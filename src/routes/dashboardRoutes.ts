import express from "express";
import { getManagerDashboard } from "../controllers/dashboardController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get(
  "/manager",
  protect,
  authorize("manager", "admin"),
  getManagerDashboard
);

export default router;