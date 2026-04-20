"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/teamController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager"), teamController_1.createTeam);
router.get("/", authMiddleware_1.protect, teamController_1.getTeams);
router.get("/:id", authMiddleware_1.protect, teamController_1.getTeamById);
router.put("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager"), teamController_1.updateTeam);
router.delete("/:id", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("admin", "manager"), teamController_1.deleteTeam);
exports.default = router;
