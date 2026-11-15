"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEmployeeSalary = void 0;
const attendanceModel_1 = __importDefault(require("../models/attendanceModel"));
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const calculateEmployeeSalary = async (employeeId, month, year) => {
    let employee;
    if (mongoose_1.default.Types.ObjectId.isValid(employeeId)) {
        employee = await employeeModel_1.default.findById(employeeId);
    }
    else {
        employee = await employeeModel_1.default.findOne({ employeeId });
    }
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
    const halfDays = attendanceRecords.filter((item) => item.status === "half_day").length;
    const absentDays = attendanceRecords.filter((item) => item.status === "absent").length;
    const leaveDays = attendanceRecords.filter((item) => item.status === "leave").length;
    const totalWorkingDays = attendanceRecords.length;
    const perDaySalary = employee.dailySalary;
    const totalSalary = (presentDays + (halfDays * 0.5)) * perDaySalary;
    return {
        employee: employee._id,
        month,
        year,
        totalWorkingDays,
        presentDays,
        halfDays,
        absentDays,
        leaveDays,
        perDaySalary,
        totalSalary,
    };
};
exports.calculateEmployeeSalary = calculateEmployeeSalary;
