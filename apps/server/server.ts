import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./src/utils/database.ts";
import { authRouter } from "./src/routes/authRoute.ts";
import { userRouter } from "./src/routes/userRoute.ts";
import { blogRouter } from "./src/routes/blogRoute.ts";
import { aiRouter } from "./src/routes/openAIRoute.ts";
import { reportRouter } from "./src/routes/reportRoute.ts";
import { likeRouter } from "./src/routes/likeRoute.ts";
import { chatRouter } from "./src/routes/chatRoute.ts";
import { app, server } from "./src/socket/socket.ts";

dotenv.config();

connectDB();

app.use(cookieParser());

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

const PORT = Number(process.env.PORT) || 5000;

app.get("/test", (req: Request, res: Response): void => {
  res.send("app is running");
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