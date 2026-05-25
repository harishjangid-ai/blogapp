import e from 'express';
import { generateBlog } from '../controllers/genrateWithAi.js';

export const aiRouter = e.Router();

aiRouter.post("/create-blog-ai", generateBlog)