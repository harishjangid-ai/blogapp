import e from "express";
import { createBlog, getBlogs, selectedBlog, writerBlogs } from "../controllers/blogController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { role } from "../middleware/roleAuth.js";

export const blogRouter = e.Router();

blogRouter.post("/create-blog", verifyToken, role(["writer"]), createBlog);
blogRouter.get("/blogs", getBlogs);
blogRouter.get("/blog/:id", selectedBlog);
blogRouter.get("/writer-blogs/:id", writerBlogs);
