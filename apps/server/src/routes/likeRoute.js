import e from "express";
import { like } from "../controllers/likeController.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const likeRouter = e.Router();

likeRouter.post("/like", verifyToken, like)
