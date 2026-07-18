import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/authService";

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid access token" });
  }
};
