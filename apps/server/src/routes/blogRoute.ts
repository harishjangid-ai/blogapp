import e from "express";
import { createBlog, deleteBlog, getBlogs, selectedBlog, trendingBlogs, userBlogs, blogCount } from "../controllers/blogController"
import { verifyToken } from "../middleware/verifyToken"
import { optionalAuth } from "../middleware/optionalAuth"
import { role } from "../middleware/roleAuth"
import { limiter } from "../middleware/rateLimiter"

export const blogRouter = e.Router();

blogRouter.post("/create-blog", limiter, verifyToken, createBlog);
blogRouter.get("/blogs",optionalAuth, getBlogs);
blogRouter.get("/blog/:id", optionalAuth, selectedBlog);
blogRouter.get("/user-blogs", verifyToken, userBlogs);
blogRouter.delete("/delete-blog/:id", verifyToken, role(["admin", "user"]), deleteBlog);
blogRouter.get("/trending-blogs", optionalAuth, trendingBlogs);
blogRouter.get("/blog-count", blogCount);
