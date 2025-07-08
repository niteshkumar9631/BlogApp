import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

// Register user
export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("User Avatar Required!", 400));
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("Invalid file type. Use png, jpg, or webp.", 400));
  }

  const { name, email, password, phone, role, education } = req.body;
  if (!name || !email || !password || !phone || !role || !education) {
    return next(new ErrorHandler("Please fill full details!", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath);
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    return next(new ErrorHandler("Cloudinary Upload Failed", 500));
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role,
    education,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  sendToken(user, 200, "User registered successfully", res);
});

// Login user
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please fill full form!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid email or password!", 400));

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) return next(new ErrorHandler("Invalid email or password!", 400));

  if (user.role !== role) {
    return next(new ErrorHandler(`Role mismatch: expected ${user.role}`, 400));
  }

  sendToken(user, 200, "User logged in successfully", res);
});

// Logout user
export const logout = catchAsyncErrors((req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "User logged out!",
    });
});

// Get current user profile
export const getMyProfile = catchAsyncErrors((req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("User not authenticated", 400));
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// Get all authors
export const getAllAuthors = catchAsyncErrors(async (req, res, next) => {
  const authors = await User.find({ role: "Author" });
  res.status(200).json({
    success: true,
    authors,
  });
});
