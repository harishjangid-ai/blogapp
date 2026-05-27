import e from "express";
import { reportBlog } from "../controllers/reportController.js";
import { limiter } from "../middleware/rateLimiter.js";
import { verifyToken } from "../middleware/verifyToken.js";
export const reportRouter = e.Router();

reportRouter.post("/new-report", limiter, verifyToken, reportBlog);
