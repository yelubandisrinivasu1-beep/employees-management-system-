"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePerformance = exports.updatePerformance = exports.getPerformanceById = exports.getPerformances = exports.createPerformance = void 0;
const performanceModel_1 = __importDefault(require("../models/performanceModel"));
const createPerformance = async (req, res) => {
    try {
        const { employeeId, month, year, rating, taskCompletionRate, attendanceRate, contributionScore, managerRemarks } = req.body;
        const performance = await performanceModel_1.default.create({
            employeeId,
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
