import express from "express";
import { admins, chatUserList, deleteUser, getSelectedUser, userList, users, saveFcmToken, userCount, editUser } from "../controllers/userConteroller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { role } from "../middleware/roleAuth.js";
export const userRouter = express.Router();

userRouter.get("/users", verifyToken, userList);
userRouter.get("/admins", verifyToken, admins);
userRouter.delete("/delete-user/:id", verifyToken, role(["admin"]), deleteUser)
userRouter.get("/chat-users", verifyToken,role(["admin", "user"]), chatUserList)
userRouter.get("/selected-user/:id", getSelectedUser);
userRouter.get("/user", verifyToken,users)
userRouter.get("/user-count", userCount)
userRouter.post("/save-fcm-token", verifyToken,role(["user"]), saveFcmToken);
userRouter.post("/edit-user", verifyToken, editUser);
