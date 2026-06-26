import e from "express";
import { blogComments, commentReply, commentsCount, getReplies, like, likes, newComment, view, views } from "../controllers/likeController.ts";
import { verifyToken } from "../middleware/verifyToken.ts";
import { role } from "../middleware/roleAuth.ts";

export const likeRouter = e.Router();

likeRouter.post("/like", verifyToken, role(["admin", "user"]), like);
likeRouter.get("/likes", likes);
likeRouter.post("/view", verifyToken, view);
likeRouter.get("/views", views)
likeRouter.post("/new-comment",verifyToken, role(["admin", "user"]) ,newComment);
likeRouter.post("/reply-comment",verifyToken, role(["admin", "user"]) ,commentReply);
likeRouter.post("/blog-comments", blogComments);
likeRouter.post("/comment-replies", getReplies);
likeRouter.post("/count", commentsCount)