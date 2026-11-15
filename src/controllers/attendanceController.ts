import { Request, Response } from "express";
import Attendance from "../models/attendanceModel";
import Employee from "../models/employeeModel";

export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employee, date, status } = req.body;

    if (!employee || !date || !status) {
      res.status(400).json({
        success: false,
        message: "Please provide employee, date and status",
      });
      return;
    }

    const existingEmployee = await Employee.findById(employee);
    if (!existingEmployee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    const attendance = await Attendance.create({
      employee,
      date,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "Attendance already marked for this date",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getEmployeeAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const attendance = await Attendance.find({ employee: req.params.employeeId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getMyAttendance = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const employee = await Employee.findOne({ user: userId });
    
    if (!employee) {
      res.status(404).json({ success: false, message: "Employee profile not found" });
      return;
    }

    const attendance = await Attendance.find({ employee: employee._id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const checkIn = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const employee = await Employee.findOne({ user: userId });
    
    if (!employee) {
      res.status(404).json({ success: false, message: "Employee profile not found" });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      employee: employee._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (existingAttendance) {
      res.status(400).json({ success: false, message: "Already checked in today" });
      return;
    }

    const attendance = await Attendance.create({
      employee: employee._id,
      date: today,
      status: "present",
      checkInTime: new Date()
    });

    res.status(201).json({ success: true, message: "Checked in successfully", data: attendance });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: "Already checked in today" });
      return;
    }
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const checkOut = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const employee = await Employee.findOne({ user: userId });
    
    if (!employee) {
      res.status(404).json({ success: false, message: "Employee profile not found" });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: employee._id,
      date: today
    });

    if (!attendance) {
      res.status(400).json({ success: false, message: "No check-in found for today" });
      return;
    }

    if (attendance.checkOutTime) {
      res.status(400).json({ success: false, message: "Already checked out today" });
      return;
    }

    attendance.checkOutTime = new Date();
    
    if (attendance.checkInTime) {
      const workHours = (attendance.checkOutTime.getTime() - attendance.checkInTime.getTime()) / (1000 * 60 * 60);
      if (workHours >= 8) {
        attendance.status = "present";
      } else if (workHours >= 4) {
        attendance.status = "half_day";
      } else {
        attendance.status = "absent";
      }
    }

    await attendance.save();

    res.status(200).json({ success: true, message: "Checked out successfully", data: attendance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};