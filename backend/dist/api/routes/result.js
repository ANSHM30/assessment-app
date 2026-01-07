"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const result_controller_1 = require("../controllers/result.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
/**
 * Candidate: View own results
 * GET /api/results/me
 */
router.get("/me", auth_middleware_1.requireAuth, (0, role_middleware_1.requireRole)("CANDIDATE"), result_controller_1.getMyResults);
exports.default = router;
