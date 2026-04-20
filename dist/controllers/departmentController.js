"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.updateDepartment = exports.getDepartmentById = exports.getDepartments = exports.createDepartment = void 0;
const departmentModel_1 = __importDefault(require("../models/departmentModel"));
const createDepartment = async (req, res) => {
    try {
        const { departmentName, departmentCode, description, managerId } = req.body;
        const departmentExists = await departmentModel_1.default.findOne({ departmentCode });
        if (departmentExists) {
            res.status(400).json({ success: false, message: "Department code already exists" });
            return;
        }
        const department = await departmentModel_1.default.create({
            departmentName,
            departmentCode,
            description,
            managerId,
        });
        res.status(201).json({ success: true, data: department });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createDepartment = createDepartment;
const getDepartments = async (req, res) => {
    try {
        const departments = await departmentModel_1.default.find().populate("managerId", "name email");
        res.status(200).json({ success: true, count: departments.length, data: departments });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDepartments = getDepartments;
const getDepartmentById = async (req, res) => {
    try {
        const department = await departmentModel_1.default.findById(req.params.id).populate("managerId", "name email");
        if (!department) {
            res.status(404).json({ success: false, message: "Department not found" });
            return;
        }
        res.status(200).json({ success: true, data: department });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDepartmentById = getDepartmentById;
const updateDepartment = async (req, res) => {
    try {
        const department = await departmentModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!department) {
            res.status(404).json({ success: false, message: "Department not found" });
            return;
        }
        res.status(200).json({ success: true, data: department });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateDepartment = updateDepartment;
const deleteDepartment = async (req, res) => {
    try {
        const department = await departmentModel_1.default.findByIdAndDelete(req.params.id);
        if (!department) {
            res.status(404).json({ success: false, message: "Department not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Department deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteDepartment = deleteDepartment;
