import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Salary from "../models/salaryModel";
import Employee from "../models/employeeModel";
import mongoose from "mongoose";
import { calculateEmployeeSalary } from "../services/salaryService";

export const generateSalary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { employeeId, month, year } = req.body;

    if (!employeeId || !month || !year) {
      res.status(400).json({
        success: false,
        message: "Please provide employeeId, month and year",
      });
      return;
    }

    // Find the employee
    let employee;
    if (mongoose.Types.ObjectId.isValid(employeeId)) {
      employee = await Employee.findById(employeeId);
    } else {
      employee = await Employee.findOne({ employeeId });
    }
    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    // Check permissions
    const userRole = req.user.role;
    const userId = req.user._id;

    if (userRole === "employee" && employee.user.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Access denied: You can only generate your own salary",
      });
      return;
    }

    const salaryData = await calculateEmployeeSalary(employeeId, Number(month), Number(year));

    const salary = await Salary.findOneAndUpdate(
      {
        employee: employeeId,
        month: Number(month),
        year: Number(year),
      },
      salaryData,
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Salary generated successfully",
      data: salary,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getEmployeeSalary = async (req: Request, res: Response): Promise<void> => {
  try {
    const salary = await Salary.find({ employee: req.params.employeeId }).sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      count: salary.length,
      data: salary,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};