"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeAttendance = exports.markAttendance = void 0;
const attendanceModel_1 = __importDefault(require("../models/attendanceModel"));
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const markAttendance = async (req, res) => {
    try {
        const { employee, date, status } = req.body;
        if (!employee || !date || !status) {
            res.status(400).json({
                success: false,
                message: "Please provide employee, date and status",
            });
            return;
        }
        const existingEmployee = await employeeModel_1.default.findById(employee);
        if (!existingEmployee) {
            res.status(404).json({
                success: false,
                message: "Employee not found",
            });
            return;
        }
        const attendance = await attendanceModel_1.default.create({
            employee,
            date,
            status,
        });
        res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            data: attendance,
        });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: "Attendance already marked for this date",
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.markAttendance = markAttendance;
const getEmployeeAttendance = async (req, res) => {
    try {
        const attendance = await attendanceModel_1.default.find({ employee: req.params.employeeId }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.getEmployeeAttendance = getEmployeeAttendance;
