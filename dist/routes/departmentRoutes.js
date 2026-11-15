"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const departmentController_1 = require("../controllers/departmentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager"), departmentController_1.createDepartment);
router.get("/", authMiddleware_1.protect, departmentController_1.getDepartments);
router.get("/:id", authMiddleware_1.protect, departmentController_1.getDepartmentById);
router.put("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), departmentController_1.updateDepartment);
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin"), departmentController_1.deleteDepartment);
exports.default = router;
