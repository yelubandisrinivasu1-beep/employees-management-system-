import express from "express";
import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} from "../controllers/teamController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", protect, authorize("admin", "manager"), createTeam);
router.get("/", protect, getTeams);
router.get("/:id", protect, getTeamById);
router.put("/:id", protect, authorize("admin", "manager"), updateTeam);
router.delete("/:id", protect, authorize("admin", "manager"), deleteTeam);

export default router;
