import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Leave from "../models/leaveModel";
import Employee from "../models/employeeModel";

export const applyLeave = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { fromDate, toDate, reason } = req.body;
    const userId = req.user?.userId || req.user?.id;

    if (!fromDate || !toDate || !reason) {
      res.status(400).json({
        success: false,
        message: "Please provide fromDate, toDate and reason",
      });
      return;
    }

    const employee = await Employee.findOne({ user: userId });

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
      return;
    }

    const leave = await Leave.create({
      employee: employee._id,
      fromDate,
      toDate,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      data: leave,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getMyLeaves = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;

    const employee = await Employee.findOne({ user: userId });

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
      return;
    }

    const leaves = await Leave.find({ employee: employee._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getAllLeaveRequests = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: "employee",
        populate: {
          path: "user",
          select: "name email role",
        },
      })
      .populate("approvedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const updateLeaveStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;
    const approverId = req.user?.userId || req.user?.id;

    if (!status || !["approved", "rejected"].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Status must be approved or rejected",
      });
      return;
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
      return;
    }

    leave.status = status;
    leave.approvedBy = approverId;
    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave ${status} successfully`,
      data: leave,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};