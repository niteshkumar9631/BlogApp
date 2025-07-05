  import express from "express";
  import dotenv from "dotenv";
  import cors from "cors";
  import cookieParser from "cookie-parser";
  import { dbConnection } from "./database/dbConnection.js";
  import { errorMiddleware } from "./middlewares/error.js";
  import userRouter from "./routes/userRouter.js";
  import blogRouter from "./routes/blogRouter.js";
  import fileUpload from "express-fileupload";

  // Initialize app and load environment variables
  const app = express();
  dotenv.config({ path: "./config/config.env" });

  // Enable CORS
  app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      methods: ["GET", "PUT", "DELETE", "POST"],
      credentials: true,
    })
  );

  // Middlewares
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );

  // Routes
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/blog", blogRouter);

  // Default root route
  app.get("/", (req, res) => {
    res.send("Welcome to the Blogging API ");
  });

  // Connect to database
  dbConnection();

  // Error handler middleware (must be last)
  app.use(errorMiddleware);

  export default app;
