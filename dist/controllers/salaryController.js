"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeSalary = exports.generateSalary = void 0;
const salaryModel_1 = __importDefault(require("../models/salaryModel"));
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const salaryService_1 = require("../services/salaryService");
const generateSalary = async (req, res) => {
    try {
        const { employeeId, month, year } = req.body;
        if (!employeeId || !month || !year) {
            res.status(400).json({
                success: false,
                message: "Please provide employeeId, month and year",
            });
            return;
        }
        // Find the employee
        let employee;
        if (mongoose_1.default.Types.ObjectId.isValid(employeeId)) {
            employee = await employeeModel_1.default.findById(employeeId);
        }
        else {
            employee = await employeeModel_1.default.findOne({ employeeId });
        }
        if (!employee) {
            res.status(404).json({
                success: false,
                message: "Employee not found",
            });
            return;
        }
        // Check permissions
        const userRole = req.user.role;
        const userId = req.user._id;
        if (userRole === "employee" && employee.user.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "Access denied: You can only generate your own salary",
            });
            return;
        }
        const salaryData = await (0, salaryService_1.calculateEmployeeSalary)(employeeId, Number(month), Number(year));
        const salary = await salaryModel_1.default.findOneAndUpdate({
            employee: employeeId,
            month: Number(month),
            year: Number(year),
        }, salaryData, {
            new: true,
            upsert: true,
        });
        res.status(200).json({
            success: true,
            message: "Salary generated successfully",
            data: salary,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.generateSalary = generateSalary;
const getEmployeeSalary = async (req, res) => {
    try {
        const salary = await salaryModel_1.default.find({ employee: req.params.employeeId }).sort({ year: -1, month: -1 });
        res.status(200).json({
            success: true,
            count: salary.length,
            data: salary,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.getEmployeeSalary = getEmployeeSalary;
