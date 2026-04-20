import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  user: mongoose.Types.ObjectId;
  employeeId: string;
  department: string;
  designation: string;
  dailySalary: number;
  joiningDate: Date;
  managerId?: mongoose.Types.ObjectId;
  technicalManagerId?: mongoose.Types.ObjectId;
}

const employeeSchema = new Schema<IEmployee>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    dailySalary: {
      type: Number,
      required: true,
      min: 0,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    technicalManagerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model<IEmployee>("Employee", employeeSchema);

export default Employee;