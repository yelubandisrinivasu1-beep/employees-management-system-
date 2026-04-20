"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSprint = exports.updateSprint = exports.getSprintById = exports.getSprints = exports.createSprint = void 0;
const sprintModel_1 = __importDefault(require("../models/sprintModel"));
const taskModel_1 = __importDefault(require("../models/taskModel"));
const createSprint = async (req, res) => {
    try {
        const { name, startDate, endDate } = req.body;
        const sprint = await sprintModel_1.default.create({
            name,
            startDate,
            endDate,
        });
        res.status(201).json({ success: true, data: sprint });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createSprint = createSprint;
const getSprints = async (req, res) => {
    try {
        const sprints = await sprintModel_1.default.find().populate("tasks");
        res.status(200).json({ success: true, count: sprints.length, data: sprints });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getSprints = getSprints;
const getSprintById = async (req, res) => {
    try {
        const sprint = await sprintModel_1.default.findById(req.params.id).populate("tasks");
        if (!sprint) {
            res.status(404).json({ success: false, message: "Sprint not found" });
            return;
        }
        res.status(200).json({ success: true, data: sprint });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getSprintById = getSprintById;
const updateSprint = async (req, res) => {
    try {
        const sprint = await sprintModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!sprint) {
            res.status(404).json({ success: false, message: "Sprint not found" });
            return;
        }
        res.status(200).json({ success: true, data: sprint });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateSprint = updateSprint;
const deleteSprint = async (req, res) => {
    try {
        const sprint = await sprintModel_1.default.findByIdAndDelete(req.params.id);
        if (!sprint) {
            res.status(404).json({ success: false, message: "Sprint not found" });
            return;
        }
        // Also remove sprintId from all tasks in this sprint
        await taskModel_1.default.updateMany({ sprintId: sprint._id }, { $unset: { sprintId: 1 } });
        res.status(200).json({ success: true, message: "Sprint deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteSprint = deleteSprint;
