"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEmployeeSalary = void 0;
const attendanceModel_1 = __importDefault(require("../models/attendanceModel"));
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const calculateEmployeeSalary = async (employeeId, month, year) => {
    const employee = await employeeModel_1.default.findById(employeeId);
    if (!employee) {
        throw new Error("Employee not found");
    }
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    const attendanceRecords = await attendanceModel_1.default.find({
        employee: employeeId,
        date: {
            $gte: startDate,
            $lte: endDate,
        },
    });
    const presentDays = attendanceRecords.filter((item) => item.status === "present").length;
    const absentDays = attendanceRecords.filter((item) => item.status === "absent").length;
    const leaveDays = attendanceRecords.filter((item) => item.status === "leave").length;
    const totalWorkingDays = attendanceRecords.length;
    const perDaySalary = employee.dailySalary;
    const totalSalary = presentDays * perDaySalary;
    return {
        employee: employee._id,
        month,
        year,
        totalWorkingDays,
        presentDays,
        absentDays,
        leaveDays,
        perDaySalary,
        totalSalary,
    };
};
exports.calculateEmployeeSalary = calculateEmployeeSalary;
