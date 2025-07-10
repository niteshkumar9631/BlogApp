import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import jwt from "jsonwebtoken";

/**
 * Authentication Middleware
 * Checks if the user is logged in by verifying JWT token from cookies.
 */
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  // If no token is found in cookies
  if (!token) {
    return next(new ErrorHandler("User is not authenticated!", 401));
  }

  try {
    // Decode the token using JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find the user in the database
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found with this token!", 404));
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token!", 401));
  }
});

/**
 * Authorization Middleware
 * Checks if the logged-in user's role is allowed to access the route.
 * @param  {...string} roles - Allowed roles (e.g., ['admin', 'editor'])
 */
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    // If user's role is not in the allowed roles array
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
