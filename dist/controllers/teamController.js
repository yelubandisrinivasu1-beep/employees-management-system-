"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeam = exports.updateTeam = exports.getTeamById = exports.getTeams = exports.createTeam = void 0;
const teamModel_1 = __importDefault(require("../models/teamModel"));
const createTeam = async (req, res) => {
    try {
        const { teamName, teamLead, members, departmentId, description } = req.body;
        const team = await teamModel_1.default.create({
            teamName,
            teamLead,
            members,
            departmentId,
            description,
        });
        res.status(201).json({ success: true, data: team });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createTeam = createTeam;
const getTeams = async (req, res) => {
    try {
        const teams = await teamModel_1.default.find()
            .populate("teamLead", "name email")
            .populate("departmentId", "departmentName departmentCode")
            .populate("members", "name email");
        res.status(200).json({ success: true, count: teams.length, data: teams });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTeams = getTeams;
const getTeamById = async (req, res) => {
    try {
        const team = await teamModel_1.default.findById(req.params.id)
            .populate("teamLead", "name email")
            .populate("departmentId", "departmentName departmentCode")
            .populate("members", "name email");
        if (!team) {
            res.status(404).json({ success: false, message: "Team not found" });
            return;
        }
        res.status(200).json({ success: true, data: team });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTeamById = getTeamById;
const updateTeam = async (req, res) => {
    try {
        const team = await teamModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!team) {
            res.status(404).json({ success: false, message: "Team not found" });
            return;
        }
        res.status(200).json({ success: true, data: team });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateTeam = updateTeam;
const deleteTeam = async (req, res) => {
    try {
        const team = await teamModel_1.default.findByIdAndDelete(req.params.id);
        if (!team) {
            res.status(404).json({ success: false, message: "Team not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Team deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteTeam = deleteTeam;
