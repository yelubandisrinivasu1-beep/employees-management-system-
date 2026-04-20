import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import User from "../models/userModel";
import Employee from "../models/employeeModel";
import Attendance from "../models/attendanceModel";
import Salary from "../models/salaryModel";

export const getEmployeeDashboard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not found in token",
      });
      return;
    }

    const user = await User.findById(userId).select("name email role isActive");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const employee = await Employee.findOne({ user: userId })
      .populate("managerId", "name email")
      .populate("technicalManagerId", "name email");

    if (!employee) {
      res.status(200).json({
        success: true,
        data: {
          profile: {
            user,
            employee: null,
          },
          summary: {
            totalAttendanceRecords: 0,
            presentDays: 0,
            absentDays: 0,
            leaveDays: 0,
            totalSalaryRecords: 0,
          },
          recentAttendance: [],
          salaryHistory: [],
        },
      });
      return;
    }

    const attendance = await Attendance.find({ employee: employee._id }).sort({ date: -1 });
    const salaryHistory = await Salary.find({ employee: employee._id }).sort({
      year: -1,
      month: -1,
    });

    const presentDays = attendance.filter((a) => a.status === "present").length;
    const absentDays = attendance.filter((a) => a.status === "absent").length;
    const leaveDays = attendance.filter((a) => a.status === "leave").length;

    res.status(200).json({
      success: true,
      data: {
        profile: {
          user,
          employee,
        },
        summary: {
          totalAttendanceRecords: attendance.length,
          presentDays,
          absentDays,
          leaveDays,
          totalSalaryRecords: salaryHistory.length,
        },
        recentAttendance: attendance.slice(0, 10),
        salaryHistory,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};