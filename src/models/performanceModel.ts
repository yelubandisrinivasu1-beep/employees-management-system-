import mongoose, { Schema, Document } from "mongoose";

export interface IPerformance extends Document {
  employeeId: mongoose.Types.ObjectId;
  month: string;
  year: number;
  rating: number;
  taskCompletionRate: number;
  attendanceRate: number;
  contributionScore: number;
  managerRemarks: string;
}

const performanceSchema = new Schema<IPerformance>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Employee ID is required"],
    },
    month: {
      type: String,
      required: [true, "Month is required"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    taskCompletionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    attendanceRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    contributionScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    managerRemarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Performance = mongoose.model<IPerformance>("Performance", performanceSchema);

export default Performance;
