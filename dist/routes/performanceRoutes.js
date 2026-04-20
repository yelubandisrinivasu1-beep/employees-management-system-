"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const performanceController_1 = require("../controllers/performanceController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager", "technical_manager"), performanceController_1.createPerformance);
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager", "technical_manager"), performanceController_1.getPerformances);
router.get("/:id", authMiddleware_1.protect, performanceController_1.getPerformanceById);
router.put("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager", "technical_manager"), performanceController_1.updatePerformance);
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager"), performanceController_1.deletePerformance);
exports.default = router;
