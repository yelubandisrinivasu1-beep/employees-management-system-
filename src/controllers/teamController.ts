import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Team from "../models/teamModel";
import User from "../models/userModel";
import Department from "../models/departmentModel";
import mongoose from "mongoose";

export const createTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamName, teamLead, members, departmentId, description } = req.body;
    const membersArray = Array.isArray(members) ? members : [];

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(teamLead)) {
      res.status(400).json({ success: false, message: "Invalid teamLead ID" });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      res.status(400).json({ success: false, message: "Invalid departmentId" });
      return;
    }
    if (membersArray.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      res.status(400).json({ success: false, message: "Invalid members array" });
      return;
    }

    // Check if teamLead exists and has a manager or technical manager role
    const lead = await User.findById(teamLead);
    if (!lead || (lead.role !== "manager" && lead.role !== "technical_manager")) {
      res.status(400).json({ success: false, message: "Invalid team lead: must be a manager or technical manager" });
      return;
    }

    // Check if department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      res.status(400).json({ success: false, message: "Department not found" });
      return;
    }

    // Check if members exist and are employees
    for (const memberId of membersArray) {
      const member = await User.findById(memberId);
      if (!member || member.role !== "employee") {
        res.status(400).json({ success: false, message: `Invalid member: ${memberId}` });
        return;
      }
    }

    const team = await Team.create({
      teamName,
      teamLead,
      members: membersArray,
      departmentId,
      description,
    });

    res.status(201).json({ success: true, data: team });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeams = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const teams = await Team.find()
      .populate("teamLead", "name email")
      .populate("departmentId", "departmentName departmentCode")
      .populate("members", "name email");
    res.status(200).json({ success: true, count: teams.length, data: teams });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeamById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("teamLead", "name email")
      .populate("departmentId", "departmentName departmentCode")
      .populate("members", "name email");
    if (!team) {
      res.status(404).json({ success: false, message: "Team not found" });
      return;
    }
    res.status(200).json({ success: true, data: team });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!team) {
      res.status(404).json({ success: false, message: "Team not found" });
      return;
    }
    res.status(200).json({ success: true, data: team });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      res.status(404).json({ success: false, message: "Team not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Team deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
