import express from "express";
import {
  admins,
  deleteUser,
  userList,
} from "../controllers/userConteroller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { role } from "../middleware/roleAuth.js";
export const userRouter = express.Router();

userRouter.get("/users", verifyToken, userList);
userRouter.get("/admins", verifyToken, admins);
userRouter.delete("/delete-user/:id", verifyToken, role(["admin"]), deleteUser)
