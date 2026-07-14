import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/RequestType";

export const verifyToken = ( req: AuthenticatedRequest, res: Response, next: NextFunction ): void => {
  const token = req.cookies.token as string | undefined;

  if (!token) {
    res.status(401).json({
      success: false,
      error: "Unauthorized - no token",
    });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err, decoded) => {
      if (err || !decoded || typeof decoded === "string") {
        res.status(401).json({
          success: false,
          error: "Unauthorized, Token invalid or expired",
        });
        return;
      }

      req.user = decoded as JwtPayload & {
        userId: string;
        userName: string;
        fullName: string;
        role: string;
      };

      next();
    }
  );
};