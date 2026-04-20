"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sprintController_1 = require("../controllers/sprintController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
// Technical Managers and Admins can manage sprints
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "technical_manager"), sprintController_1.createSprint);
router.get("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "technical_manager", "employee", "manager"), sprintController_1.getSprints);
router.get("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "technical_manager", "employee", "manager"), sprintController_1.getSprintById);
router.put("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "technical_manager"), sprintController_1.updateSprint);
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "technical_manager"), sprintController_1.deleteSprint);
exports.default = router;
