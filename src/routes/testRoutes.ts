import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/manager", protect, authorize("manager"), (req, res) => {
  res.json({ message: "Manager Dashboard Access" });
});

router.get("/employee", protect, authorize("employee"), (req, res) => {
  res.json({ message: "Employee Dashboard Access" });
});

router.get("/technical", protect, authorize("technical_manager"), (req, res) => {
  res.json({ message: "Technical Manager Dashboard Access" });
});

export default router;