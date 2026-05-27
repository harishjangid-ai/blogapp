import express from "express";
import {
  admins,
  userList,
} from "../controllers/userConteroller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { role } from "../middleware/roleAuth.js";
export const userRouter = express.Router();

userRouter.get("/users", verifyToken, userList);
userRouter.get("/admins", verifyToken, admins);

