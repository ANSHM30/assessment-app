import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { enforceTimeLimit } from "../../services/timer.service";

export async function enforceAttemptTimer(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const attemptId =
    req.body.attemptId ||
    req.params.attemptId ||
    req.query.attemptId;

  if (!attemptId) return next();

  const result = await enforceTimeLimit(Number(attemptId));

  if (result.expired) {
    return res.status(403).json({
      message: "Time expired. Attempt auto-submitted.",
      autoSubmitted: true,
      reason: "TIME_EXPIRED",
    });
  }

  next();
}
