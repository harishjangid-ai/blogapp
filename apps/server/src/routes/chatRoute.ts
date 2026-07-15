import e from "express";
import { addMoreUsers, addMoreUsersList, createNewGroup, deleteGroup, exitGroup, getMyChat, removeUserFromGroup, sendMessage, updateAdmin, deleteMessage, editGroupDetails } from "../controllers/messageController.ts";
import { verifyToken } from "../middleware/verifyToken.ts";
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
chatRouter.post("/edit-group", verifyToken, editGroupDetails);
