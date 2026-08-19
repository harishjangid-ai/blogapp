import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./src/utils/database.js";
import { authRouter } from "./src/routes/authRoute.js";
import { userRouter } from "./src/routes/userRoute.js";
import { blogRouter } from "./src/routes/blogRoute.js";
import { aiRouter } from "./src/routes/openAIRoute.js";
import { reportRouter } from "./src/routes/reportRoute.js";
import { likeRouter } from "./src/routes/likeRoute.js";
import { chatRouter } from "./src/routes/chatRoute.js";
import { app, server } from "./src/socket/socket.js";

dotenv.config();

connectDB();

app.use(cookieParser());

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://blogapp-web-psi.vercel.app", "https://blogapp-web-psi.vercel.app/login"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

const PORT = Number(process.env.PORT) || 5000;

app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "app is running" });
});

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", blogRouter);
app.use("/api", aiRouter);
app.use("/api", reportRouter);
app.use("/api", likeRouter);
app.use("/api", chatRouter);

server.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});