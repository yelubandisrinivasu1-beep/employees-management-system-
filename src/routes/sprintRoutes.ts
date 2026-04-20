import express from "express";
import {
  createSprint,
  getSprints,
  getSprintById,
  updateSprint,
  deleteSprint,
} from "../controllers/sprintController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

// Managers, Technical Managers, and Admins can manage sprints
router.post("/", protect, authorize("admin", "technical_manager", "manager"), createSprint);
router.get("/", protect, authorize("admin", "technical_manager", "employee", "manager"), getSprints);
router.get("/:id", protect, authorize("admin", "technical_manager", "employee", "manager"), getSprintById);
router.put("/:id", protect, authorize("admin", "technical_manager", "manager"), updateSprint);
router.delete("/:id", protect, authorize("admin", "technical_manager", "manager"), deleteSprint);

export default router;
