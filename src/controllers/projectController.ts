import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Project from "../models/projectModel";

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      projectName,
      description,
      teamId,
      managerId,
      assignedEmployees,
      startDate,
      endDate,
      budget,
      priority,
      status,
      progress,
    } = req.body;

    const project = await Project.create({
      projectName,
      description,
      teamId,
      managerId,
      assignedEmployees,
      startDate,
      endDate,
      budget,
      priority,
      status,
      progress,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await Project.find()
      .populate("teamId", "teamName")
      .populate("managerId", "name email")
      .populate("assignedEmployees", "name email");
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("teamId", "teamName")
      .populate("managerId", "name email")
      .populate("assignedEmployees", "name email");
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }
    res.status(200).json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }
    res.status(200).json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
