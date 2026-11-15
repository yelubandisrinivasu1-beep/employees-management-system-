"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.getEmployeeById = exports.getAllEmployees = exports.createEmployee = void 0;
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const createEmployee = async (req, res) => {
    try {
        const { name, email, password, employeeId, department, designation, dailySalary, joiningDate, managerId, technicalManagerId, } = req.body;
        if (!name || !email || !password || !employeeId || !department || !designation || dailySalary === undefined) {
            res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
            return;
        }
        const existingUser = await userModel_1.default.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "A user with this email already exists",
            });
            return;
        }
        const newUser = await userModel_1.default.create({
            name,
            email: email.toLowerCase(),
            password: password, // Let the User model pre-save hook hash the password
            role: "employee",
        });
        const user = newUser._id;
        const existingEmployee = await employeeModel_1.default.findOne({ employeeId });
        if (existingEmployee) {
            res.status(400).json({
                success: false,
                message: "Employee ID already exists",
            });
            return;
        }
        const employee = await employeeModel_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.createEmployee = createEmployee;
const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeModel_1.default.find()
            .populate("user", "name email role")
            .populate("managerId", "name email")
            .populate("technicalManagerId", "name email");
        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.getAllEmployees = getAllEmployees;
const getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeModel_1.default.findById(req.params.id)
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.getEmployeeById = getEmployeeById;
const deleteEmployee = async (req, res) => {
    try {
        const employee = await employeeModel_1.default.findByIdAndDelete(req.params.id);
        if (!employee) {
            res.status(404).json({
                success: false,
                message: "Employee not found",
            });
            return;
        }
        if (employee.user) {
            await userModel_1.default.findByIdAndDelete(employee.user);
        }
        res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.deleteEmployee = deleteEmployee;
