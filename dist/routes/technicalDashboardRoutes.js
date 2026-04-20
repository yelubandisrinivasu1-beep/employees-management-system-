"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const technicalDashboardController_1 = require("../controllers/technicalDashboardController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("technical_manager", "admin"), technicalDashboardController_1.getTechnicalManagerDashboard);
exports.default = router;
