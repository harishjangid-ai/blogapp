import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/RequestType";

interface TokenPayload extends JwtPayload {
  userId: string;
}

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token as string | undefined;

    if (!token) {
      req.user = undefined;
      next();
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch {
    req.user = undefined;
    next();
  }
};