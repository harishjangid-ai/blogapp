import e from "express";
import { like, likes, view, views } from "../controllers/likeController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { role } from "../middleware/roleAuth.js";

export const likeRouter = e.Router();

likeRouter.post("/like", verifyToken, role(["admin", "user"]), like);
likeRouter.get("/likes", likes);
likeRouter.post("/view", verifyToken, view);
likeRouter.get("/views", views)