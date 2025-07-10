import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import jwt from "jsonwebtoken";

/**
 * Authentication Middleware
 * Verifies JWT token from cookies and attaches user info to the request object.
 */
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  // Check if token exists and is not empty
  if (!token || token.trim() === "") {
    return next(new ErrorHandler("User is not authenticated!", 401));
  }

  try {
    // Decode the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Fetch user by ID and return lean object for performance
    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return next(new ErrorHandler("User not found with this token!", 404));
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    // Optional: differentiate token errors
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Session expired. Please login again.", 401));
    }

    return next(new ErrorHandler("Invalid or expired token!", 401));
  }
});

/**
 * Authorization Middleware
 * Restricts access to certain roles.
 * @param  {...string} roles - Roles allowed to access the route
 */
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    // Ensure isAuthenticated middleware ran before this
    if (!req.user || !req.user.role) {
      return next(new ErrorHandler("User information is missing for authorization!", 403));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource.`,
          403
        )
      );
    }

    next();
  };
};
