import express from "express";
import { loginUser, registerUser, logoutUser, getAuthLogs, getMyAuthLogs, resetPassword } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.get("/logs", protect, authorize("admin", "manager"), getAuthLogs);
router.get("/my-logs", protect, getMyAuthLogs);

router.post("/reset-password", resetPassword);

export default router;