import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/RequestType";

export const role = (roles: string[] = []) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }

    next();
  };
};