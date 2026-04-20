"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = void 0;
const projectModel_1 = __importDefault(require("../models/projectModel"));
const createProject = async (req, res) => {
    try {
        const { projectName, description, teamId, managerId, assignedEmployees, startDate, endDate, budget, priority, status, progress, } = req.body;
        const project = await projectModel_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createProject = createProject;
const getProjects = async (req, res) => {
    try {
        const projects = await projectModel_1.default.find()
            .populate("teamId", "teamName")
            .populate("managerId", "name email")
            .populate("assignedEmployees", "name email");
        res.status(200).json({ success: true, count: projects.length, data: projects });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    try {
        const project = await projectModel_1.default.findById(req.params.id)
            .populate("teamId", "teamName")
            .populate("managerId", "name email")
            .populate("assignedEmployees", "name email");
        if (!project) {
            res.status(404).json({ success: false, message: "Project not found" });
            return;
        }
        res.status(200).json({ success: true, data: project });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProjectById = getProjectById;
const updateProject = async (req, res) => {
    try {
        const project = await projectModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!project) {
            res.status(404).json({ success: false, message: "Project not found" });
            return;
        }
        res.status(200).json({ success: true, data: project });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const project = await projectModel_1.default.findByIdAndDelete(req.params.id);
        if (!project) {
            res.status(404).json({ success: false, message: "Project not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Project deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteProject = deleteProject;
