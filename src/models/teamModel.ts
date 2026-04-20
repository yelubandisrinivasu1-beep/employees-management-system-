import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  teamName: string;
  teamLead: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  departmentId: mongoose.Types.ObjectId;
  description: string;
}

const teamSchema = new Schema<ITeam>(
  {
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      unique: true,
    },
    teamLead: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Team lead is required"],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department ID is required"],
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model<ITeam>("Team", teamSchema);

export default Team;
