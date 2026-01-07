"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAttempt = startAttempt;
exports.submitAttempt = submitAttempt;
const db_1 = __importDefault(require("../../config/db"));
const timer_service_1 = require("../../services/timer.service");
const scoring_service_1 = require("../../services/scoring.service");
async function startAttempt(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { assessmentId } = req.body;
        const userId = req.user.userId; // UUID
        if (!assessmentId) {
            return res.status(400).json({ message: "assessmentId is required" });
        }
        // 1️⃣ Check assessment (schema: is_active BOOLEAN)
        const assessment = await db_1.default.query("SELECT id FROM assessments WHERE id = $1 AND status = 'ACTIVE'", [assessmentId]);
        if (!assessment.rowCount || assessment.rowCount === 0) {
            return res
                .status(404)
                .json({ message: "Assessment not found or inactive" });
        }
        // 2️⃣ Check existing active attempt (schema: status = 'started')
        const activeAttempt = await db_1.default.query(`SELECT id FROM attempts
   WHERE user_id = $1
     AND assessment_id = $2
     AND status = 'IN_PROGRESS'`, [userId, assessmentId]);
        if (activeAttempt.rowCount && activeAttempt.rowCount > 0) {
            return res.status(409).json({
                message: "An active attempt already exists",
                attemptId: activeAttempt.rows[0].id,
            });
        }
        // 3️⃣ Create new attempt
        const attempt = await db_1.default.query(`INSERT INTO attempts (user_id, assessment_id, status, start_time)
   VALUES ($1, $2, 'IN_PROGRESS', NOW())
   RETURNING id`, [userId, assessmentId]);
        return res.status(201).json({
            message: "Attempt started",
            attemptId: attempt.rows[0].id,
        });
    }
    catch (error) {
        console.error("❌ startAttempt error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
async function submitAttempt(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { attemptId } = req.body;
        const userId = req.user.userId;
        if (!attemptId) {
            return res.status(400).json({ message: "attemptId is required" });
        }
        await (0, scoring_service_1.autoGradeMCQs)(attemptId);
        const finalScore = await (0, scoring_service_1.calculateFinalScore)(attemptId);
        // 1️⃣ Fetch attempt
        const attemptResult = await db_1.default.query(`SELECT id, status FROM attempts
       WHERE id = $1 AND user_id = $2`, [attemptId, userId]);
        if (attemptResult.rowCount === 0) {
            return res.status(404).json({ message: "Attempt not found" });
        }
        const attempt = attemptResult.rows[0];
        // 2️⃣ Enforce timer BEFORE submit
        const timerCheck = await (0, timer_service_1.enforceTimeLimit)(attemptId);
        if (timerCheck.expired) {
            return res.status(403).json({
                message: "Time expired. Attempt auto-submitted.",
                autoSubmitted: true,
                reason: "TIME_EXPIRED",
            });
        }
        // 3️⃣ Ensure attempt is still active
        if (attempt.status !== "IN_PROGRESS") {
            return res.status(409).json({
                message: "Attempt already submitted",
            });
        }
        // 4️⃣ Submit attempt manually
        await db_1.default.query(`UPDATE attempts
       SET status = 'SUBMITTED',
           end_time = NOW()
       WHERE id = $1 AND status = 'IN_PROGRESS'`, [attemptId]);
        return res.json({
            message: "Attempt submitted successfully",
        });
    }
    catch (error) {
        console.error("❌ submitAttempt error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
