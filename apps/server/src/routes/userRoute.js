import express from "express";
import {
  admins,
  reader,
  userList,
  writer,
} from "../controllers/userConteroller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { role } from "../middleware/roleAuth.js";
export const userRouter = express.Router();

userRouter.get("/users", verifyToken, role(["admin"]), userList);
userRouter.get("/admins", verifyToken, role(["admin"]), admins);
userRouter.get("/readers", verifyToken, role(["admin"]), reader);
userRouter.get("/writers", verifyToken, role(["admin"]), writer);

