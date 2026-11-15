"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager"), employeeController_1.createEmployee);
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager", "technical_manager"), employeeController_1.getAllEmployees);
router.get("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager", "technical_manager", "employee"), employeeController_1.getEmployeeById);
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager"), employeeController_1.deleteEmployee);
exports.default = router;
