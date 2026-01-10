import {
  getAssessments,
  getAttemptsByAssessment,
  getViolationsByAttempt,
  getAttemptSummary,
  getDescriptiveAnswers,
  getAttemptDetails,
  gradeDescriptiveAnswer,
  publishResult,
  createAssessment,
  addQuestion,
  bulkAddQuestions,
  getAssessmentQuestions,
  deleteQuestion,
  getCandidates,
  addCandidate,
} from "../controllers/admin.controller";
import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";
const router = Router();

/**
 * All admin routes are protected here
 */
router.use(requireAuth, requireAdmin);

router.get("/assessments", getAssessments);
router.get("/assessments/:assessmentId/questions", getAssessmentQuestions);
router.get(
  "/assessments/:assessmentId/attempts",
  requireAuth,
  requireAdmin,
  getAttemptsByAssessment
);
router.get("/attempts/:attemptId", getAttemptSummary);
router.get("/attempts/:attemptId/details", getAttemptDetails);
router.get("/attempts/:attemptId/violations", getViolationsByAttempt);
router.get("/attempts/:attemptId/descriptive", getDescriptiveAnswers);
router.post("/answers/grade", gradeDescriptiveAnswer);
router.post("/attempts/:attemptId/publish", publishResult);

router.post("/assessments", createAssessment);
router.post("/assessments/:assessmentId/questions", addQuestion);
router.post("/assessments/:assessmentId/questions/bulk", bulkAddQuestions);
router.delete("/assessments/:assessmentId/questions/:questionId", deleteQuestion);

router.get("/candidates", getCandidates);
router.post("/candidates", addCandidate);

export default router;
