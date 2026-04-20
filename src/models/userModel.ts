import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "manager" | "technical_manager" | "employee" | "admin";
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["manager", "technical_manager", "employee", "admin"],
      required: [true, "Role is required"],
      default: "employee",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token method
userSchema.methods.generateAuthToken = function (): string {
  return jwt.sign(
    { userId: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;