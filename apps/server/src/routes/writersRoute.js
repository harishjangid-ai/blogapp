import e from 'express';
import { writers } from '../controllers/writerCont.js';

export const writerRouter = e.Router();

writerRouter.get("/all-writer", writers);