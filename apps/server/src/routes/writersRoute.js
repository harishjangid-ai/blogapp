import e from 'express';
import { selectedWriter, writers } from '../controllers/writerCont.js';

export const writerRouter = e.Router();

writerRouter.get("/all-writer", writers);
writerRouter.post("/sel-writer", selectedWriter);