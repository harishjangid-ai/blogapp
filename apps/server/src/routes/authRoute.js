import express from "express";
import { signUp } from "../controllers/signUpController.js";
import { getCurrentUser, loginUser, logoutUser } from "../controllers/loginController.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", loginUser);
authRouter.get("/me", verifyToken, getCurrentUser);
authRouter.post("/logout", verifyToken, logoutUser);
