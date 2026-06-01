import e from "express";
import { blogComments, comments, like, likes, newComment, view, views } from "../controllers/likeController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { role } from "../middleware/roleAuth.js";

export const likeRouter = e.Router();

likeRouter.post("/like", verifyToken, role(["admin", "user"]), like);
likeRouter.get("/likes", likes);
likeRouter.post("/view", verifyToken, view);
likeRouter.get("/views", views)
likeRouter.post("/new-comment",verifyToken, role(["admin", "user"]) ,newComment);
likeRouter.post("/blog-comments", blogComments);
likeRouter.get("/comments", comments);