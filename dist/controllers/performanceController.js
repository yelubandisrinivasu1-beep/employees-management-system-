"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePerformance = exports.updatePerformance = exports.getPerformanceById = exports.getPerformances = exports.createPerformance = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const performanceModel_1 = __importDefault(require("../models/performanceModel"));
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const resolveEmployeeReference = async (employeeId) => {
    if (!employeeId)
        return undefined;
    if (mongoose_1.default.Types.ObjectId.isValid(employeeId)) {
        const user = await userModel_1.default.findById(employeeId);
        if (user)
            return user._id;
        const employee = await employeeModel_1.default.findById(employeeId);
        if (employee)
            return employee.user;
    }
    const employee = await employeeModel_1.default.findOne({ employeeId });
    return employee === null || employee === void 0 ? void 0 : employee.user;
};
const createPerformance = async (req, res) => {
    try {
        const { employeeId, month, year, rating, taskCompletionRate, attendanceRate, contributionScore, managerRemarks } = req.body;
        let employeeRef;
        if (mongoose_1.default.Types.ObjectId.isValid(employeeId)) {
            const user = await userModel_1.default.findById(employeeId);
            if (user) {
                employeeRef = user._id;
            }
            else {
                const employee = await employeeModel_1.default.findById(employeeId);
                if (employee) {
                    employeeRef = employee.user;
                }
            }
        }
        if (!employeeRef) {
            employeeRef = await resolveEmployeeReference(employeeId);
        }
        if (!employeeRef) {
            res.status(404).json({ success: false, message: "Employee not found" });
            return;
        }
        const performance = await performanceModel_1.default.create({
            employeeId: employeeRef,
            month,
            year,
            rating,
            taskCompletionRate,
            attendanceRate,
            contributionScore,
            managerRemarks,
        });
        res.status(201).json({ success: true, data: performance });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createPerformance = createPerformance;
const getPerformances = async (req, res) => {
    try {
        const performances = await performanceModel_1.default.find().populate("employeeId", "name email");
        res.status(200).json({ success: true, count: performances.length, data: performances });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPerformances = getPerformances;
const getPerformanceById = async (req, res) => {
    try {
        const performance = await performanceModel_1.default.findById(req.params.id).populate("employeeId", "name email");
        if (!performance) {
            res.status(404).json({ success: false, message: "Performance not found" });
            return;
        }
        res.status(200).json({ success: true, data: performance });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPerformanceById = getPerformanceById;
const updatePerformance = async (req, res) => {
    try {
        if (req.body.employeeId) {
            const employeeRef = await resolveEmployeeReference(req.body.employeeId);
            if (!employeeRef) {
                res.status(404).json({ success: false, message: "Employee not found" });
                return;
            }
            req.body.employeeId = employeeRef;
        }
        const performance = await performanceModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!performance) {
            res.status(404).json({ success: false, message: "Performance not found" });
            return;
        }
        res.status(200).json({ success: true, data: performance });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updatePerformance = updatePerformance;
const deletePerformance = async (req, res) => {
    try {
        const performance = await performanceModel_1.default.findByIdAndDelete(req.params.id);
        if (!performance) {
            res.status(404).json({ success: false, message: "Performance not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Performance deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deletePerformance = deletePerformance;
