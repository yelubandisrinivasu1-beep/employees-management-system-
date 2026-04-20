import { Request, Response } from "express";
import Employee from "../models/employeeModel";
import Attendance from "../models/attendanceModel";
import Salary from "../models/salaryModel";

export const getManagerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // total employees
    const totalEmployees = await Employee.countDocuments();

    // today's attendance
    const todayAttendance = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const presentToday = todayAttendance.filter(a => a.status === "present").length;
    const absentToday = todayAttendance.filter(a => a.status === "absent").length;
    const leaveToday = todayAttendance.filter(a => a.status === "leave").length;

    // salary stats
    const totalSalaryRecords = await Salary.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        presentToday,
        absentToday,
        leaveToday,
        totalSalaryRecords,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};