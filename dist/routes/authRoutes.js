"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post("/register", authController_1.registerUser);
router.post("/login", authController_1.loginUser);
router.post("/logout", authMiddleware_1.protect, authController_1.logoutUser);
router.get("/logs", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager"), authController_1.getAuthLogs);
router.get("/my-logs", authMiddleware_1.protect, authController_1.getMyAuthLogs);
router.post("/reset-password", authController_1.resetPassword);
exports.default = router;
