import e from "express";
import { createBlog, deleteBlog, getBlogs, selectedBlog, trendingBlogs, userBlogs } from "../controllers/blogController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import { role } from "../middleware/roleAuth.js";
import { limiter } from "../middleware/rateLimiter.js";

export const blogRouter = e.Router();

blogRouter.post("/create-blog", limiter, verifyToken, createBlog);
blogRouter.get("/blogs",optionalAuth, getBlogs);
blogRouter.get("/blog/:id", optionalAuth, selectedBlog);
blogRouter.get("/user-blogs/:id", verifyToken, userBlogs);
blogRouter.delete("/delete-blog/:id", verifyToken, role(["admin", "user"]), deleteBlog);
blogRouter.get("/trending-blogs", optionalAuth, trendingBlogs);
