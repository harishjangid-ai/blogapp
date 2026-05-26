import e from 'express';
import { generateBlog } from '../controllers/genrateWithAi.js';
import { limiter } from '../middleware/rateLimiter.js';

export const aiRouter = e.Router();

aiRouter.post("/create-blog-ai",limiter, generateBlog)