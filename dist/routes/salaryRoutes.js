"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salaryController_1 = require("../controllers/salaryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post("/generate", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager", "technical_manager", "employee"), salaryController_1.generateSalary);
router.get("/:employeeId", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager", "employee"), salaryController_1.getEmployeeSalary);
exports.default = router;
