import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Sprint from "../models/sprintModel";
import Task from "../models/taskModel";

export const createSprint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, startDate, endDate } = req.body;

    const sprint = await Sprint.create({
      name,
      startDate,
      endDate,
    });

    res.status(201).json({ success: true, data: sprint });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSprints = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sprints = await Sprint.find().populate("tasks");
    res.status(200).json({ success: true, count: sprints.length, data: sprints });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSprintById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sprint = await Sprint.findById(req.params.id).populate("tasks");
    if (!sprint) {
      res.status(404).json({ success: false, message: "Sprint not found" });
      return;
    }
    res.status(200).json({ success: true, data: sprint });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSprint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!sprint) {
      res.status(404).json({ success: false, message: "Sprint not found" });
      return;
    }
    res.status(200).json({ success: true, data: sprint });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSprint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sprint = await Sprint.findByIdAndDelete(req.params.id);
    if (!sprint) {
      res.status(404).json({ success: false, message: "Sprint not found" });
      return;
    }
    // Also remove sprintId from all tasks in this sprint
    await Task.updateMany({ sprintId: sprint._id }, { $unset: { sprintId: 1 } });
    
    res.status(200).json({ success: true, message: "Sprint deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
