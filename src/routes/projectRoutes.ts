import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/", protect, authorize("admin", "manager"), createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, authorize("admin", "manager"), updateProject);
router.delete("/:id", protect, authorize("admin", "manager"), deleteProject);

export default router;
