import mongoose, { Schema, Document } from "mongoose";

export interface ISalary extends Document {
  employee: mongoose.Types.ObjectId;
  month: number;
  year: number;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  perDaySalary: number;
  totalSalary: number;
}

const salarySchema = new Schema<ISalary>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    totalWorkingDays: {
      type: Number,
      required: true,
    },
    presentDays: {
      type: Number,
      required: true,
    },
    absentDays: {
      type: Number,
      required: true,
    },
    leaveDays: {
      type: Number,
      required: true,
    },
    perDaySalary: {
      type: Number,
      required: true,
    },
    totalSalary: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

salarySchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

const Salary = mongoose.model<ISalary>("Salary", salarySchema);

export default Salary;