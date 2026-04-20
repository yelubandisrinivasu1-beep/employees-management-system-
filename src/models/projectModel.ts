import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  projectName: string;
  description: string;
  teamId: mongoose.Types.ObjectId;
  managerId: mongoose.Types.ObjectId;
  assignedEmployees: mongoose.Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  budget: number;
  priority: "low" | "medium" | "high" | "urgent";
  status: "planned" | "active" | "on_hold" | "completed" | "cancelled";
  progress: number;
}

const projectSchema = new Schema<IProject>(
  {
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Manager ID is required"],
    },
    assignedEmployees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    budget: {
      type: Number,
      default: 0,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["planned", "active", "on_hold", "completed", "cancelled"],
      default: "planned",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;
