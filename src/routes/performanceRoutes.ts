import express from "express";
import {
  createPerformance,
  getPerformances,
  getPerformanceById,
  updatePerformance,
  deletePerformance,
} from "../controllers/performanceController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", protect, authorize("admin", "manager", "technical_manager"), createPerformance);
router.get("/", protect, authorize("admin", "manager", "technical_manager"), getPerformances);
router.get("/:id", protect, getPerformanceById);
router.put("/:id", protect, authorize("admin", "manager", "technical_manager"), updatePerformance);
router.delete("/:id", protect, authorize("admin", "manager"), deletePerformance);

export default router;
