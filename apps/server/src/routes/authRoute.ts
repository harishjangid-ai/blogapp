import express from "express";
import { signUp } from "../controllers/signUpController"
import { changePassword, getCurrentUser, loginUser, logoutUser, refreshToken } from "../controllers/loginController"
import { verifyToken } from "../middleware/verifyToken"
import { limiter } from "../middleware/rateLimiter"

export const authRouter = express.Router();

authRouter.post("/signup", limiter, signUp);
authRouter.post("/login", limiter, loginUser);
authRouter.get("/me", verifyToken, getCurrentUser);
authRouter.post("/logout", limiter, verifyToken, logoutUser);
authRouter.post("/change-password", verifyToken, changePassword);
authRouter.post("/refresh-token", refreshToken);