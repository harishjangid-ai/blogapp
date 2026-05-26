import express from "express";
import { signUp } from "../controllers/signUpController.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../controllers/loginController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { limiter } from "../middleware/rateLimiter.js";

export const authRouter = express.Router();

authRouter.post("/signup", limiter, signUp);
authRouter.post("/login", limiter, loginUser);
authRouter.get("/me", verifyToken, getCurrentUser);
authRouter.post("/logout", limiter, verifyToken, logoutUser);
