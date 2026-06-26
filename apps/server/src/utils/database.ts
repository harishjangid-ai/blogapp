import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};