"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagerDashboard = void 0;
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const attendanceModel_1 = __importDefault(require("../models/attendanceModel"));
const salaryModel_1 = __importDefault(require("../models/salaryModel"));
const getManagerDashboard = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        // total employees
        const totalEmployees = await employeeModel_1.default.countDocuments();
        // today's attendance
        const todayAttendance = await attendanceModel_1.default.find({
            date: { $gte: startOfDay, $lte: endOfDay },
        });
        const presentToday = todayAttendance.filter(a => a.status === "present").length;
        const absentToday = todayAttendance.filter(a => a.status === "absent").length;
        const leaveToday = todayAttendance.filter(a => a.status === "leave").length;
        // salary stats
        const totalSalaryRecords = await salaryModel_1.default.countDocuments();
        res.status(200).json({
            success: true,
            data: {
                totalEmployees,
                presentToday,
                absentToday,
                leaveToday,
                totalSalaryRecords,
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
exports.getManagerDashboard = getManagerDashboard;
