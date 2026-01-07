"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logViolation = logViolation;
const db_1 = __importDefault(require("../../config/db"));
const violation_service_1 = require("../../services/violation.service");
const timer_service_1 = require("../../services/timer.service");
async function logViolation(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { attemptId, violationType } = req.body;
        const userId = req.user.userId;
        if (!attemptId || !violationType) {
            return res.status(400).json({
                message: "attemptId and violationType are required",
            });
        }
        // 1️⃣ Validate attempt ownership
        const attemptResult = await db_1.default.query(`SELECT status FROM attempts
       WHERE id = $1 AND user_id = $2`, [attemptId, userId]);
        if (attemptResult.rowCount === 0) {
            return res.status(404).json({ message: "Attempt not found" });
        }
        if (attemptResult.rows[0].status !== "IN_PROGRESS") {
            return res.status(409).json({
                message: "Attempt already submitted",
            });
        }
        const timerCheck = await (0, timer_service_1.enforceTimeLimit)(attemptId);
        if (timerCheck.expired) {
            return res.status(403).json({
                message: "Time expired. Attempt auto-submitted.",
                autoSubmitted: true,
                reason: "TIME_EXPIRED",
            });
        }
        // 2️⃣ Insert violation
        await db_1.default.query(`INSERT INTO violations (attempt_id, violation_type)
       VALUES ($1, $2)`, [attemptId, violationType]);
        // 3️⃣ Check auto-submit rules
        const enforcement = await (0, violation_service_1.checkAutoSubmit)(attemptId);
        if (enforcement.autoSubmit) {
            await db_1.default.query(`UPDATE attempts
         SET status = 'AUTO_SUBMITTED',
             end_time = NOW()
         WHERE id = $1 AND status = 'IN_PROGRESS'`, [attemptId]);
            return res.status(200).json({
                message: "Violation logged. Attempt auto-submitted.",
                autoSubmitted: true,
                reason: enforcement.reason,
            });
        }
        return res.status(201).json({
            message: "Violation logged",
            autoSubmitted: false,
        });
    }
    catch (error) {
        console.error("❌ logViolation error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
