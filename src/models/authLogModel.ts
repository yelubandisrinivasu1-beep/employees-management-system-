import mongoose, { Schema, Document } from "mongoose";

export interface IAuthLog extends Document {
  user: mongoose.Types.ObjectId;
  action: "login" | "logoff";
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const authLogSchema = new Schema<IAuthLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["login", "logoff"],
      required: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// We want to sort logs by time descending, so let's index the createdAt
authLogSchema.index({ createdAt: -1 });

const AuthLog = mongoose.model<IAuthLog>("AuthLog", authLogSchema);

export default AuthLog;
