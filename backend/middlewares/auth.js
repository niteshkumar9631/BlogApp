// middlewares/auth.js

import { catchAsyncErrors } from "./catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// ✅ Authentication Middleware
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token || token.trim() === "") {
    return next(new ErrorHandler("User is not authenticated!", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Session expired. Please login again.", 401));
    }
    return next(new ErrorHandler("Invalid or expired token!", 401));
  }
});

// ✅ Authorization Middleware
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user?.role || "unknown"}) is not allowed to access this resource.`,
          403
        )
      );
    }

    next();
  };
};
