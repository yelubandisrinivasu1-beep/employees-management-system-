import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    type: {
      type: String,
      default: "general",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
