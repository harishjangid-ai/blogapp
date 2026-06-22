import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
