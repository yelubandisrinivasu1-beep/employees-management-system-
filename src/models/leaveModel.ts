import mongoose, { Schema, Document } from "mongoose";

export interface ILeave extends Document {
  employee: mongoose.Types.ObjectId;
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: mongoose.Types.ObjectId;
}

const leaveSchema = new Schema<ILeave>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Leave = mongoose.model<ILeave>("Leave", leaveSchema);

export default Leave;