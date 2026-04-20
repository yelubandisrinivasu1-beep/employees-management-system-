import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Employee from "../models/employeeModel";
import User from "../models/userModel";

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      employeeId,
      department,
      designation,
      dailySalary,
      joiningDate,
      managerId,
      technicalManagerId,
    } = req.body;

    if (!name || !email || !password || !employeeId || !department || !designation || dailySalary === undefined) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
      return;
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: password, // Let the User model pre-save hook hash the password
      role: "employee",
    });

    const user = newUser._id;

    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      res.status(400).json({
        success: false,
        message: "Employee ID already exists",
      });
      return;
    }

    const employee = await Employee.create({
      user,
      employeeId,
      department,
      designation,
      dailySalary,
      joiningDate,
      managerId,
      technicalManagerId,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await Employee.find()
      .populate("user", "name email role")
      .populate("managerId", "name email")
      .populate("technicalManagerId", "name email");

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("user", "name email role")
      .populate("managerId", "name email")
      .populate("technicalManagerId", "name email");

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    if (employee.user) {
      await User.findByIdAndDelete(employee.user);
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};