import { Router } from "express";
import { getMyResults } from "../controllers/result.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

/**
 * Candidate: View own results
 * GET /api/results/me
 */
router.get(
  "/me",
  requireAuth,
  requireRole("CANDIDATE"),
  getMyResults
);

export default router;
