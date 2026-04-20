"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeDashboard = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const attendanceModel_1 = __importDefault(require("../models/attendanceModel"));
const salaryModel_1 = __importDefault(require("../models/salaryModel"));
const getEmployeeDashboard = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not found in token",
            });
            return;
        }
        const user = await userModel_1.default.findById(userId).select("name email role isActive");
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const employee = await employeeModel_1.default.findOne({ user: userId })
            .populate("managerId", "name email")
            .populate("technicalManagerId", "name email");
        if (!employee) {
            res.status(200).json({
                success: true,
                data: {
                    profile: {
                        user,
                        employee: null,
                    },
                    summary: {
                        totalAttendanceRecords: 0,
                        presentDays: 0,
                        absentDays: 0,
                        leaveDays: 0,
                        totalSalaryRecords: 0,
                    },
                    recentAttendance: [],
                    salaryHistory: [],
                },
            });
            return;
        }
        const attendance = await attendanceModel_1.default.find({ employee: employee._id }).sort({ date: -1 });
        const salaryHistory = await salaryModel_1.default.find({ employee: employee._id }).sort({
            year: -1,
            month: -1,
        });
        const presentDays = attendance.filter((a) => a.status === "present").length;
        const absentDays = attendance.filter((a) => a.status === "absent").length;
        const leaveDays = attendance.filter((a) => a.status === "leave").length;
        res.status(200).json({
            success: true,
            data: {
                profile: {
                    user,
                    employee,
                },
                summary: {
                    totalAttendanceRecords: attendance.length,
                    presentDays,
                    absentDays,
                    leaveDays,
                    totalSalaryRecords: salaryHistory.length,
                },
                recentAttendance: attendance.slice(0, 10),
                salaryHistory,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.getEmployeeDashboard = getEmployeeDashboard;
