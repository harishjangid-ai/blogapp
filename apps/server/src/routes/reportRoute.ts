import e from "express";
import { getReports, isReported, reportBlog, updateReportStatus, reportCount } from "../controllers/reportController";
import { limiter } from "../middleware/rateLimiter";
import { verifyToken } from "../middleware/verifyToken";
export const reportRouter = e.Router();

reportRouter.post("/new-report", limiter, verifyToken, reportBlog);
reportRouter.get("/get-reports", verifyToken, getReports);
reportRouter.put("/update-report-status", verifyToken, updateReportStatus);
reportRouter.post("/is-reported", verifyToken, isReported);
reportRouter.get("/report-count", reportCount);