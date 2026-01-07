import { Router } from "express";
import {
  getAssessments,
  getAttemptsByAssessment,
  getViolationsByAttempt,
  getAttemptSummary,
  getDescriptiveAnswers,
  gradeDescriptiveAnswer,
  publishResult,
} from "../controllers/admin.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";

const router = Router();

/**
 * All admin routes are protected here
 */
router.use(requireAuth, requireAdmin);

router.get("/assessments", getAssessments);
router.get("/assessments/:assessmentId/attempts", getAttemptsByAssessment);
router.get("/attempts/:attemptId", getAttemptSummary);
router.get("/attempts/:attemptId/violations", getViolationsByAttempt);
router.get("/attempts/:attemptId/descriptive", getDescriptiveAnswers);
router.post("/answers/grade", gradeDescriptiveAnswer);
router.post("/attempts/:attemptId/publish", publishResult);

export default router;
