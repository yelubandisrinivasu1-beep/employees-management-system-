"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager"), projectController_1.createProject);
router.get("/", authMiddleware_1.protect, projectController_1.getProjects);
router.get("/:id", authMiddleware_1.protect, projectController_1.getProjectById);
router.put("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager"), projectController_1.updateProject);
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager"), projectController_1.deleteProject);
exports.default = router;
