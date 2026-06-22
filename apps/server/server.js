import e from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/utils/database.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { authRouter } from "./src/routes/authRoute.js";
import { userRouter } from "./src/routes/userRoute.js";
import { blogRouter } from "./src/routes/blogRoute.js";
import { aiRouter } from "./src/routes/openAIRoute.js";
import { reportRouter } from "./src/routes/reportRoute.js";
import { likeRouter } from "./src/routes/likeRoute.js";
import { app, server } from "./src/socket/socket.js";
import { chatRouter } from "./src/routes/chatRoute.js";

connectDB();
dotenv.config();

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
  res.send("app is running");
});
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", blogRouter);
app.use("/api", aiRouter);
app.use("/api", reportRouter);
app.use("/api", likeRouter);
app.use("/api", chatRouter)

server.listen(PORT);
