import e from "express";
import { createBlog, getBlogs, selectedBlog, userBlogs } from "../controllers/blogController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { role } from "../middleware/roleAuth.js";
import { limiter } from "../middleware/rateLimiter.js";

export const blogRouter = e.Router();

blogRouter.post("/create-blog", limiter, verifyToken, createBlog);
blogRouter.get("/blogs", getBlogs);
blogRouter.get("/blog/:id", selectedBlog);
blogRouter.get("/user-blogs/:id", userBlogs);
