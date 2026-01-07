"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
/**
 * All admin routes are protected here
 */
router.use(auth_middleware_1.requireAuth, role_middleware_1.requireAdmin);
router.get("/assessments", admin_controller_1.getAssessments);
router.get("/assessments/:assessmentId/attempts", admin_controller_1.getAttemptsByAssessment);
router.get("/attempts/:attemptId", admin_controller_1.getAttemptSummary);
router.get("/attempts/:attemptId/violations", admin_controller_1.getViolationsByAttempt);
router.get("/attempts/:attemptId/descriptive", admin_controller_1.getDescriptiveAnswers);
router.post("/answers/grade", admin_controller_1.gradeDescriptiveAnswer);
router.post("/attempts/:attemptId/publish", admin_controller_1.publishResult);
exports.default = router;
