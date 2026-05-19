import e from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { connectDB } from './src/utils/database.js';

connectDB();
dotenv.config();

const app = e();

app.get("/test", (req, res)=>{
    res.send("app is runnning");
});

app.listen(5050);