import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
    minLength: [3, "Name must contain at least 3 characters!"],
    maxLength: [32, "Name cannot exceed 32 characters!"],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email!"],
  },
  phone: {
    type: Number,
    required: [true, "Phone number is required!"],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  education: {
    type: String,
    required: [true, "Education is required!"],
  },
  role: {
    type: String,
    required: [true, "Role is required!"],
    enum: ["Reader", "Author"],
    default: "Reader",
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    maxLength: [32, "Password cannot exceed 32 characters!"],
    select: false, // important: exclude password from query by default
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Compare entered password with DB password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔐 Generate JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES, // e.g., '7d'
  });
};

export const User = mongoose.model("User", userSchema);
