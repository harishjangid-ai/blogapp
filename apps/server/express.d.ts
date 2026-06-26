declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        userName?: string;
        fullName?: string;
        role?: string;
      };
    }
  }
}

export {};