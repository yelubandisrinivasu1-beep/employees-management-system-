"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeDashboardController_1 = require("../controllers/employeeDashboardController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("employee"), employeeDashboardController_1.getEmployeeDashboard);
exports.default = router;
