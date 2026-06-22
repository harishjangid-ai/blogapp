import e from "express";
import { addMoreUsers, addMoreUsersList, createNewGroup, deleteGroup, exitGroup, getMyChat, removeUserFromGroup, sendMessage, updateAdmin, deleteMessage } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import admin from "../config/firebase.js"
import User from "../models/userModel.js";
export const chatRouter = e.Router();
chatRouter.post("/new-msg", verifyToken ,sendMessage);
chatRouter.get("/my-chat/:id", verifyToken, getMyChat);
chatRouter.post("/create-group", verifyToken, createNewGroup);
chatRouter.post("/delete-group", verifyToken, deleteGroup);
chatRouter.post("/remove-user", verifyToken, removeUserFromGroup);
chatRouter.post("/exit-group", verifyToken, exitGroup);
chatRouter.post("/more-users", addMoreUsersList)
chatRouter.post("/add-users",verifyToken, addMoreUsers)
chatRouter.post("/switch-admin", verifyToken, updateAdmin);
chatRouter.post("/delete-message", verifyToken, deleteMessage);
