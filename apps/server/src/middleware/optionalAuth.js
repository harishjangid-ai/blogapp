import jwt from "jsonwebtoken";

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify( token, process.env.JWT_SECRET );
    req.user = {
      userId: decoded.userId,
    };
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};