import express from 'express';
import { userList } from '../controllers/userConteroller.js';

const userRouter = express.Router();

userRouter.get("/users", userList)

export default userRouter;