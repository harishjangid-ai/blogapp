import e from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/utils/database.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { authRouter } from "./src/routes/authRoute.js";

connectDB();
dotenv.config();

const app = e();
app.use(cookieParser());
app.use(e.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

const PORT = process.env.PORT;

app.get("/test", (req, res) => {
  res.send("app is runnning");
});
app.use("/api", authRouter);

app.listen(PORT);
