import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ success: false, error: "Unauthrized - no token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({
        success: false,
        error: "Unutherized, Token invalid or expired",
      });
    }
    req.user = decoded;
    next();
  });
};
