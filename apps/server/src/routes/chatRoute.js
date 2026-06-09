import e from "express";
import { createNewGroup, deleteGroup, exitGroup, getMyChat, removeUserFromGroup } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/verifyToken.js";
// import { createChat } from "../controller/chatController.js";

export const chatRouter = e.Router();
// chatRouter.post("/create-chat/:id", verifyToken ,createChat);
chatRouter.get("/my-chat/:id", verifyToken, getMyChat);
chatRouter.post("/create-group", verifyToken, createNewGroup);
chatRouter.post("/delete-group", verifyToken, deleteGroup);
chatRouter.post("/remove-user", verifyToken, removeUserFromGroup);
chatRouter.post("/exit-group", verifyToken, exitGroup);
