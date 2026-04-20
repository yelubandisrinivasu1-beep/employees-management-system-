"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTechnicalManagerDashboard = void 0;
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const attendanceModel_1 = __importDefault(require("../models/attendanceModel"));
const getTechnicalManagerDashboard = async (req, res) => {
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
        const teamEmployees = await employeeModel_1.default.find({ technicalManagerId: userId })
            .populate("user", "name email role")
            .populate("managerId", "name email")
            .populate("technicalManagerId", "name email");
        const employeeIds = teamEmployees.map((emp) => emp._id);
        const teamAttendance = await attendanceModel_1.default.find({
            employee: { $in: employeeIds },
        }).sort({ date: -1 });
        const presentCount = teamAttendance.filter((a) => a.status === "present").length;
        const absentCount = teamAttendance.filter((a) => a.status === "absent").length;
        const leaveCount = teamAttendance.filter((a) => a.status === "leave").length;
        res.status(200).json({
            success: true,
            data: {
                totalTeamEmployees: teamEmployees.length,
                totalAttendanceRecords: teamAttendance.length,
                presentCount,
                absentCount,
                leaveCount,
                teamEmployees,
                recentAttendance: teamAttendance.slice(0, 20),
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
exports.getTechnicalManagerDashboard = getTechnicalManagerDashboard;
