import e from "express";
import { approvedRequests, checkRequest, newWriter, pendingRequests, rejectedRequests, requests, reqUpdate } from "../controllers/requestCont.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { role } from "../middleware/roleAuth.js";
import { limiter } from "../middleware/rateLimiter.js";

export const requestRouter = e.Router();
requestRouter.post("/new-req", limiter ,verifyToken, role(["reader"]), newWriter);
requestRouter.get("/requests", verifyToken, role(["admin"]), requests);
requestRouter.get("/pending-requests", verifyToken, role(["admin"]), pendingRequests);
requestRouter.get("/approved-requests", verifyToken, role(["admin"]), approvedRequests);
requestRouter.get("/rejected-requests", verifyToken, role(["admin"]), rejectedRequests);
requestRouter.put("/request-update", verifyToken, role(["admin"]), reqUpdate);
requestRouter.get("/check-request", verifyToken, role(["reader"]), checkRequest)
