"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("technical_manager", "admin"), taskController_1.createTask);
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager"), taskController_1.getAllTasks);
router.get("/my-tasks", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("employee"), taskController_1.getMyTasks);
router.patch("/:id/status", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("employee"), taskController_1.updateTaskStatus);
router.patch("/:id/reply", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("employee"), taskController_1.updateTaskReply);
router.get("/technical-manager", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("technical_manager", "admin"), taskController_1.getTechnicalManagerTasks);
router.put("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("technical_manager", "admin", "manager"), taskController_1.updateTask);
router.post("/:id/comments", authMiddleware_1.protect, taskController_1.addTaskComment);
exports.default = router;
