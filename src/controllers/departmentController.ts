import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Department from "../models/departmentModel";
import User from "../models/userModel";

export const createDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { departmentName, departmentCode, description, managerId } = req.body;

    // Check if managerId exists and has role "manager"
    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "manager") {
      res.status(400).json({ success: false, message: "Invalid manager ID" });
      return;
    }

    const departmentExists = await Department.findOne({ departmentCode });
    if (departmentExists) {
      res.status(400).json({ success: false, message: "Department code already exists" });
      return;
    }

    const department = await Department.create({
      departmentName,
      departmentCode,
      description,
      managerId,
    });

    res.status(201).json({ success: true, data: department });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDepartments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const departments = await Department.find().populate("managerId", "name email");
    res.status(200).json({ success: true, count: departments.length, data: departments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDepartmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const department = await Department.findById(req.params.id).populate("managerId", "name email");
    if (!department) {
      res.status(404).json({ success: false, message: "Department not found" });
      return;
    }
    res.status(200).json({ success: true, data: department });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!department) {
      res.status(404).json({ success: false, message: "Department not found" });
      return;
    }
    res.status(200).json({ success: true, data: department });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      res.status(404).json({ success: false, message: "Department not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Department deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
