import express from "express";
import { signUp } from "../controllers/signUpController.ts";
import { changePassword, getCurrentUser, loginUser, logoutUser, refreshToken } from "../controllers/loginController.ts";
import { verifyToken } from "../middleware/verifyToken.ts";
import { limiter } from "../middleware/rateLimiter.ts";

export const authRouter = express.Router();

authRouter.post("/signup", limiter, signUp);
authRouter.post("/login", limiter, loginUser);
authRouter.get("/me", verifyToken, getCurrentUser);
authRouter.post("/logout", limiter, verifyToken, logoutUser);
authRouter.post("/change-password", verifyToken, changePassword);
authRouter.post("/refresh-token", refreshToken);