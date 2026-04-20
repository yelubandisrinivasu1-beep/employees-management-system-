"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveController_1 = require("../controllers/leaveController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("employee"), leaveController_1.applyLeave);
router.get("/my-leaves", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("employee"), leaveController_1.getMyLeaves);
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("manager", "admin"), leaveController_1.getAllLeaveRequests);
router.patch("/:id/status", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("manager", "admin"), leaveController_1.updateLeaveStatus);
exports.default = router;
