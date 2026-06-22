import e from "express";
import { getReports, isReported, reportBlog, updateReportStatus } from "../controllers/reportController.js";
import { limiter } from "../middleware/rateLimiter.js";
import { verifyToken } from "../middleware/verifyToken.js";
export const reportRouter = e.Router();

reportRouter.post("/new-report", limiter, verifyToken, reportBlog);
reportRouter.get("/get-reports", verifyToken, getReports);
reportRouter.put("/update-report-status", verifyToken, updateReportStatus);
reportRouter.post("/is-reported", verifyToken, isReported);