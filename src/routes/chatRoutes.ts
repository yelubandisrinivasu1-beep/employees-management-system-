import express from "express";
import { getConversationHistory, getContactList } from "../controllers/chatController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/contacts", protect, getContactList);
router.get("/:otherUserId", protect, getConversationHistory);

export default router;
