import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  employee: mongoose.Types.ObjectId;
  date: Date;
  status: "present" | "absent" | "leave" | "half_day";
  checkInTime?: Date;
  checkOutTime?: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "leave", "half_day"],
      default: "present",
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema);

export default Attendance;