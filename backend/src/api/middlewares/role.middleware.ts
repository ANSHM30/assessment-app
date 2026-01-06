import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export function requireCandidate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const role = req.user?.role?.toUpperCase();
  if (role !== "CANDIDATE") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}
