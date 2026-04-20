import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Employee from "../models/employeeModel";
import Attendance from "../models/attendanceModel";

export const getTechnicalManagerDashboard = async (
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

    const teamEmployees = await Employee.find({ technicalManagerId: userId })
      .populate("user", "name email role")
      .populate("managerId", "name email")
      .populate("technicalManagerId", "name email");

    const employeeIds = teamEmployees.map((emp) => emp._id);

    const teamAttendance = await Attendance.find({
      employee: { $in: employeeIds },
    }).sort({ date: -1 });

    const presentCount = teamAttendance.filter((a) => a.status === "present").length;
    const absentCount = teamAttendance.filter((a) => a.status === "absent").length;
    const leaveCount = teamAttendance.filter((a) => a.status === "leave").length;

    res.status(200).json({
      success: true,
      data: {
        totalTeamEmployees: teamEmployees.length,
        totalAttendanceRecords: teamAttendance.length,
        presentCount,
        absentCount,
        leaveCount,
        teamEmployees,
        recentAttendance: teamAttendance.slice(0, 20),
      },
    });
  } catch (error: any) {
    console.error("Technical Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};