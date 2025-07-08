import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import blogRouter from "./routes/blogRouter.js";

// Initialize app
const app = express();

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect to database
dbConnection();

// ✅ CORS Middleware — allow frontend Vercel + local
const allowedOrigins = [
  "http://localhost:5173",
  "https://blog-app-frontend-murex-three.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the Blogging API 🚀");
});

// Error handler
app.use(errorMiddleware);

export default app;
