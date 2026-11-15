"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOut = exports.checkIn = exports.getMyAttendance = exports.getEmployeeAttendance = exports.markAttendance = void 0;
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
const getMyAttendance = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        const employee = await employeeModel_1.default.findOne({ user: userId });
        if (!employee) {
            res.status(404).json({ success: false, message: "Employee profile not found" });
            return;
        }
        const attendance = await attendanceModel_1.default.find({ employee: employee._id }).sort({ date: -1 });
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
exports.getMyAttendance = getMyAttendance;
const checkIn = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        const employee = await employeeModel_1.default.findOne({ user: userId });
        if (!employee) {
            res.status(404).json({ success: false, message: "Employee profile not found" });
            return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingAttendance = await attendanceModel_1.default.findOne({
            employee: employee._id,
            date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        });
        if (existingAttendance) {
            res.status(400).json({ success: false, message: "Already checked in today" });
            return;
        }
        const attendance = await attendanceModel_1.default.create({
            employee: employee._id,
            date: today,
            status: "present",
            checkInTime: new Date()
        });
        res.status(201).json({ success: true, message: "Checked in successfully", data: attendance });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ success: false, message: "Already checked in today" });
            return;
        }
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};
exports.checkIn = checkIn;
const checkOut = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        const employee = await employeeModel_1.default.findOne({ user: userId });
        if (!employee) {
            res.status(404).json({ success: false, message: "Employee profile not found" });
            return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const attendance = await attendanceModel_1.default.findOne({
            employee: employee._id,
            date: today
        });
        if (!attendance) {
            res.status(400).json({ success: false, message: "No check-in found for today" });
            return;
        }
        if (attendance.checkOutTime) {
            res.status(400).json({ success: false, message: "Already checked out today" });
            return;
        }
        attendance.checkOutTime = new Date();
        if (attendance.checkInTime) {
            const workHours = (attendance.checkOutTime.getTime() - attendance.checkInTime.getTime()) / (1000 * 60 * 60);
            if (workHours >= 8) {
                attendance.status = "present";
            }
            else if (workHours >= 4) {
                attendance.status = "half_day";
            }
            else {
                attendance.status = "absent";
            }
        }
        await attendance.save();
        res.status(200).json({ success: true, message: "Checked out successfully", data: attendance });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};
exports.checkOut = checkOut;
