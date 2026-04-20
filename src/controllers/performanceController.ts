import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import mongoose from "mongoose";
import Performance from "../models/performanceModel";
import Employee from "../models/employeeModel";
import User from "../models/userModel";

const resolveEmployeeReference = async (employeeId: string) => {
  if (!employeeId) return undefined;

  if (mongoose.Types.ObjectId.isValid(employeeId)) {
    const user = await User.findById(employeeId);
    if (user) return user._id;

    const employee = await Employee.findById(employeeId);
    if (employee) return employee.user as mongoose.Types.ObjectId;
  }

  const employee = await Employee.findOne({ employeeId });
  return employee?.user as mongoose.Types.ObjectId | undefined;
};

export const createPerformance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { employeeId, month, year, rating, taskCompletionRate, attendanceRate, contributionScore, managerRemarks } = req.body;

    let employeeRef: mongoose.Types.ObjectId | undefined;

    if (mongoose.Types.ObjectId.isValid(employeeId)) {
      const user = await User.findById(employeeId);
      if (user) {
        employeeRef = user._id;
      } else {
        const employee = await Employee.findById(employeeId);
        if (employee) {
          employeeRef = employee.user as mongoose.Types.ObjectId;
        }
      }
    }

    if (!employeeRef) {
      employeeRef = await resolveEmployeeReference(employeeId);
    }

    if (!employeeRef) {
      res.status(404).json({ success: false, message: "Employee not found" });
      return;
    }

    const performance = await Performance.create({
      employeeId: employeeRef,
      month,
      year,
      rating,
      taskCompletionRate,
      attendanceRate,
      contributionScore,
      managerRemarks,
    });

    res.status(201).json({ success: true, data: performance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerformances = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const performances = await Performance.find().populate("employeeId", "name email");
    res.status(200).json({ success: true, count: performances.length, data: performances });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerformanceById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const performance = await Performance.findById(req.params.id).populate("employeeId", "name email");
    if (!performance) {
      res.status(404).json({ success: false, message: "Performance not found" });
      return;
    }
    res.status(200).json({ success: true, data: performance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePerformance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.body.employeeId) {
      const employeeRef = await resolveEmployeeReference(req.body.employeeId);
      if (!employeeRef) {
        res.status(404).json({ success: false, message: "Employee not found" });
        return;
      }
      req.body.employeeId = employeeRef;
    }

    const performance = await Performance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!performance) {
      res.status(404).json({ success: false, message: "Performance not found" });
      return;
    }
    res.status(200).json({ success: true, data: performance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePerformance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const performance = await Performance.findByIdAndDelete(req.params.id);
    if (!performance) {
      res.status(404).json({ success: false, message: "Performance not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Performance deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
