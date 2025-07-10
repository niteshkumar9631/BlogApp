// middlewares/error.js

// Custom Error Handler Class
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Capture full stack trace (for debugging)
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global Error Middleware
export const errorMiddleware = (err, req, res, next) => {
  // Default status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // 🔍 Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors).map((val) => val.message).join(", ");
    statusCode = 400;
  }

  // 🔍 Handle Mongoose CastError (invalid _id)
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
  }

  // 🔍 Handle MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value entered for field: ${field}`;
    statusCode = 409;
  }

  // Final error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      // Only show stack trace in development
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

export default ErrorHandler;
