import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Task from "../models/taskModel";
import Employee from "../models/employeeModel";
import Sprint from "../models/sprintModel";

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, employee, priority, dueDate, sprintId } = req.body;
    const assignedBy = req.user?.userId || req.user?.id;

    if (!title || !employee) {
      res.status(400).json({
        success: false,
        message: "Please provide title and employee",
      });
      return;
    }

    const employeeExists = await Employee.findById(employee);

    if (!employeeExists) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    const task = await Task.create({
      title,
      description,
      employee,
      assignedBy,
      priority,
      dueDate,
      sprintId,
      activityLog: [{ action: "Task Created", userId: assignedBy }],
    });

    // Sync with Sprint model
    if (sprintId) {
      await Sprint.findByIdAndUpdate(sprintId, { $push: { tasks: task._id } });
    }

    const io = req.app.get("io");
    if (io && employeeExists) {
      io.to(employeeExists.user.toString()).emit("task_assigned", task);
    }

    res.status(201).json({
      success: true,
      message: "Task assigned successfully",
      data: task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getAllTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find()
      .populate({
        path: "employee",
        populate: {
          path: "user",
          select: "name email role",
        },
      })
      .populate("assignedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getMyTasks = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const tasks = await Task.find({ employee: employee._id })
      .populate("assignedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const userId = req.user?.userId || req.user?.id;

    if (!status) {
      res.status(400).json({
        success: false,
        message: "Please provide status",
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

    const task = await Task.findOne({
      _id: req.params.id,
      employee: employee._id,
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    task.status = status;
    await task.save();

    const io = req.app.get("io");
    if (io) {
      if (employee.managerId) {
        io.to(employee.managerId.toString()).emit("task_updated", task);
      }
      if (employee.technicalManagerId) {
        io.to(employee.technicalManagerId.toString()).emit("task_updated", task);
      }
    }

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const updateTaskReply = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reply } = req.body;
    const userId = req.user?.userId || req.user?.id;

    if (!reply) {
      res.status(400).json({
        success: false,
        message: "Please provide a reply",
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

    const task = await Task.findOne({
      _id: req.params.id,
      employee: employee._id,
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    task.employeeReply = reply;
    await task.save();

    const io = req.app.get("io");
    if (io) {
      if (employee.technicalManagerId) {
        io.to(employee.technicalManagerId.toString()).emit("task_updated", task);
      }
    }

    res.status(200).json({
      success: true,
      message: "Task reply updated successfully",
      data: task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getTechnicalManagerTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;

    const teamEmployees = await Employee.find({ technicalManagerId: userId });
    const employeeIds = teamEmployees.map((emp) => emp._id);

    const tasks = await Task.find({ employee: { $in: employeeIds } })
      .populate({
        path: "employee",
        populate: {
          path: "user",
          select: "name email role",
        },
      })
      .populate("assignedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }
    const oldSprintId = task.sprintId;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (updatedTask) {
      updatedTask.activityLog.push({ action: "Task Updated", userId });
      await updatedTask.save();

      // Sync with Sprint model if sprintId changed
      if (req.body.sprintId !== undefined && String(oldSprintId) !== String(req.body.sprintId)) {
        // Remove from old sprint
        if (oldSprintId) {
          await Sprint.findByIdAndUpdate(oldSprintId, { $pull: { tasks: task._id } });
        }
        // Add to new sprint
        if (req.body.sprintId) {
          await Sprint.findByIdAndUpdate(req.body.sprintId, { $push: { tasks: task._id } });
        }
      }
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("task_updated", updatedTask);
    }

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addTaskComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const userId = req.user?.userId || req.user?.id;

    if (!text) {
      res.status(400).json({ success: false, message: "Comment text is required" });
      return;
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    task.comments.push({ userId, text, createdAt: new Date() });
    task.activityLog.push({ action: "Added Comment", userId });
    await task.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("task_comment_added", task);
    }

    res.status(200).json({ success: true, data: task });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};