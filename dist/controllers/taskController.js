"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTaskComment = exports.updateTask = exports.getTechnicalManagerTasks = exports.updateTaskReply = exports.updateTaskStatus = exports.getMyTasks = exports.getAllTasks = exports.createTask = void 0;
const taskModel_1 = __importDefault(require("../models/taskModel"));
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const createTask = async (req, res) => {
    var _a, _b;
    try {
        const { title, description, employee, priority, dueDate, sprintId } = req.body;
        const assignedBy = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!title || !employee) {
            res.status(400).json({
                success: false,
                message: "Please provide title and employee",
            });
            return;
        }
        const employeeExists = await employeeModel_1.default.findById(employee);
        if (!employeeExists) {
            res.status(404).json({
                success: false,
                message: "Employee not found",
            });
            return;
        }
        const task = await taskModel_1.default.create({
            title,
            description,
            employee,
            assignedBy,
            priority,
            dueDate,
            sprintId,
            activityLog: [{ action: "Task Created", userId: assignedBy }],
        });
        const io = req.app.get("io");
        if (io && employeeExists) {
            io.to(employeeExists.user.toString()).emit("task_assigned", task);
        }
        res.status(201).json({
            success: true,
            message: "Task assigned successfully",
            data: task,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.createTask = createTask;
const getAllTasks = async (req, res) => {
    try {
        const tasks = await taskModel_1.default.find()
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.getAllTasks = getAllTasks;
const getMyTasks = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        const employee = await employeeModel_1.default.findOne({ user: userId });
        if (!employee) {
            res.status(404).json({
                success: false,
                message: "Employee profile not found",
            });
            return;
        }
        const tasks = await taskModel_1.default.find({ employee: employee._id })
            .populate("assignedBy", "name email role")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.getMyTasks = getMyTasks;
const updateTaskStatus = async (req, res) => {
    var _a, _b;
    try {
        const { status } = req.body;
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!status) {
            res.status(400).json({
                success: false,
                message: "Please provide status",
            });
            return;
        }
        const employee = await employeeModel_1.default.findOne({ user: userId });
        if (!employee) {
            res.status(404).json({
                success: false,
                message: "Employee profile not found",
            });
            return;
        }
        const task = await taskModel_1.default.findOne({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.updateTaskStatus = updateTaskStatus;
const updateTaskReply = async (req, res) => {
    var _a, _b;
    try {
        const { reply } = req.body;
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!reply) {
            res.status(400).json({
                success: false,
                message: "Please provide a reply",
            });
            return;
        }
        const employee = await employeeModel_1.default.findOne({ user: userId });
        if (!employee) {
            res.status(404).json({
                success: false,
                message: "Employee profile not found",
            });
            return;
        }
        const task = await taskModel_1.default.findOne({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.updateTaskReply = updateTaskReply;
const getTechnicalManagerTasks = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        const teamEmployees = await employeeModel_1.default.find({ technicalManagerId: userId });
        const employeeIds = teamEmployees.map((emp) => emp._id);
        const tasks = await taskModel_1.default.find({ employee: { $in: employeeIds } })
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.getTechnicalManagerTasks = getTechnicalManagerTasks;
const updateTask = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        const task = await taskModel_1.default.findById(req.params.id);
        if (!task) {
            res.status(404).json({ success: false, message: "Task not found" });
            return;
        }
        const updatedTask = await taskModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (updatedTask) {
            updatedTask.activityLog.push({ action: "Task Updated", userId });
            await updatedTask.save();
        }
        const io = req.app.get("io");
        if (io) {
            io.emit("task_updated", updatedTask);
        }
        res.status(200).json({ success: true, data: updatedTask });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateTask = updateTask;
const addTaskComment = async (req, res) => {
    var _a, _b;
    try {
        const { text } = req.body;
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!text) {
            res.status(400).json({ success: false, message: "Comment text is required" });
            return;
        }
        const task = await taskModel_1.default.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.addTaskComment = addTaskComment;
