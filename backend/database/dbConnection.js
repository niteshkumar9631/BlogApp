import mongoose from "mongoose";
import dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config();

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "MERN_STACK_BLOGGING_APP",
    })
    .then(() => {
      console.log("✅ Connected to database!");
    })
    .catch((err) => {
      console.log(`❌ Some error occurred while connecting to database: ${err}`);
    });
};
