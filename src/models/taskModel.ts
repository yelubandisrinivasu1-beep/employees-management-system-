import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  employee: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId;
  status: "pending" | "in_progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  employeeReply?: string;
  sprintId?: mongoose.Types.ObjectId;
  comments: { userId: mongoose.Types.ObjectId; text: string; createdAt?: Date }[];
  activityLog: { action: string; userId: mongoose.Types.ObjectId; createdAt?: Date }[];
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "review", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    employeeReply: {
      type: String,
      trim: true,
    },
    sprintId: {
      type: Schema.Types.ObjectId,
      ref: "Sprint",
    },
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    activityLog: [
      {
        action: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;