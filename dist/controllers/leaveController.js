"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeaveStatus = exports.getAllLeaveRequests = exports.getMyLeaves = exports.applyLeave = void 0;
const leaveModel_1 = __importDefault(require("../models/leaveModel"));
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
const applyLeave = async (req, res) => {
    var _a, _b;
    try {
        const { fromDate, toDate, reason } = req.body;
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!fromDate || !toDate || !reason) {
            res.status(400).json({
                success: false,
                message: "Please provide fromDate, toDate and reason",
            });
            return;
        }
        const employee = await employeeModel_1.default.findOne({ user: userId });
        if (!employee) {
            res.status(404).json({
                success: false,
                message: "Employee profile not found",
            });
            return;
        }
        const leave = await leaveModel_1.default.create({
            employee: employee._id,
            fromDate,
            toDate,
            reason,
        });
        res.status(201).json({
            success: true,
            message: "Leave applied successfully",
            data: leave,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.applyLeave = applyLeave;
const getMyLeaves = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        const employee = await employeeModel_1.default.findOne({ user: userId });
        if (!employee) {
            res.status(404).json({
                success: false,
                message: "Employee profile not found",
            });
            return;
        }
        const leaves = await leaveModel_1.default.find({ employee: employee._id }).sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.getMyLeaves = getMyLeaves;
const getAllLeaveRequests = async (req, res) => {
    try {
        const leaves = await leaveModel_1.default.find()
            .populate({
            path: "employee",
            populate: {
                path: "user",
                select: "name email role",
            },
        })
            .populate("approvedBy", "name email role")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.getAllLeaveRequests = getAllLeaveRequests;
const updateLeaveStatus = async (req, res) => {
    var _a, _b;
    try {
        const { status } = req.body;
        const approverId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!status || !["approved", "rejected"].includes(status)) {
            res.status(400).json({
                success: false,
                message: "Status must be approved or rejected",
            });
            return;
        }
        const leave = await leaveModel_1.default.findById(req.params.id);
        if (!leave) {
            res.status(404).json({
                success: false,
                message: "Leave request not found",
            });
            return;
        }
        leave.status = status;
        leave.approvedBy = approverId;
        await leave.save();
        res.status(200).json({
            success: true,
            message: `Leave ${status} successfully`,
            data: leave,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};
exports.updateLeaveStatus = updateLeaveStatus;
