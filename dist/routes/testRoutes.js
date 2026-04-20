"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.get("/manager", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("manager"), (req, res) => {
    res.json({ message: "Manager Dashboard Access" });
});
router.get("/employee", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("employee"), (req, res) => {
    res.json({ message: "Employee Dashboard Access" });
});
router.get("/technical", authMiddleware_1.protect, (0, roleMiddleware_1.authorize)("technical_manager"), (req, res) => {
    res.json({ message: "Technical Manager Dashboard Access" });
});
exports.default = router;
