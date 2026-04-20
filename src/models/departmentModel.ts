import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  departmentName: string;
  departmentCode: string;
  description: string;
  managerId: mongoose.Types.ObjectId;
}

const departmentSchema = new Schema<IDepartment>(
  {
    departmentName: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
      unique: true,
    },
    departmentCode: {
      type: String,
      required: [true, "Department code is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model<IDepartment>("Department", departmentSchema);

export default Department;
