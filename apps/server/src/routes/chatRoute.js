import e from "express";
import { createNewGroup, getMyChat } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/verifyToken.js";
// import { createChat } from "../controller/chatController.js";

export const chatRouter = e.Router();
// chatRouter.post("/create-chat/:id", verifyToken ,createChat);
chatRouter.get("/my-chat/:id", verifyToken, getMyChat);
chatRouter.post("/create-group", verifyToken, createNewGroup);
