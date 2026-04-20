import mongoose, { Schema, Document } from "mongoose";

export interface ISprint extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  tasks: mongoose.Types.ObjectId[];
  progress: number;
}

const sprintSchema = new Schema<ISprint>(
  {
    name: {
      type: String,
      required: [true, "Sprint name is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
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

const Sprint = mongoose.model<ISprint>("Sprint", sprintSchema);

export default Sprint;
