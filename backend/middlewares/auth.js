import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import jwt from "jsonwebtoken";

// ✅ AUTHENTICATION Middleware
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Log cookies to debug if needed
  // console.log("Received cookies:", req.cookies);

  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User is not authenticated!", 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token!", 401));
  }
});

// ✅ AUTHORIZATION Middleware
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `User with role (${req.user?.role || "unknown"}) is not allowed to access this resource.`,
          403
        )
      );
    }

    next();
  };
};
