"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizeAttemptIfComplete = finalizeAttemptIfComplete;
const db_1 = __importDefault(require("../config/db"));
const result_service_1 = require("./result.service");
/**
 * Finalizes an attempt if all answers are graded
 */
async function finalizeAttemptIfComplete(attemptId) {
    // 1️⃣ Check for ungraded answers
    const pending = await db_1.default.query(`
    SELECT COUNT(*) AS remaining
    FROM answers
    WHERE attempt_id = $1
      AND is_graded = false
    `, [attemptId]);
    const remaining = Number(pending.rows[0].remaining);
    if (remaining > 0) {
        // Still waiting for grading
        return { finalized: false };
    }
    // 2️⃣ Recalculate final score (safety)
    await db_1.default.query(`
    UPDATE attempts
    SET final_score = (
      SELECT COALESCE(SUM(marks_obtained), 0)
      FROM answers
      WHERE attempt_id = $1
    )
    WHERE id = $1
    `, [attemptId]);
    // 3️⃣ Calculate PASS / FAIL
    const result = await (0, result_service_1.calculatePassFail)(attemptId);
    return {
        finalized: true,
        result: result.result,
        percentage: result.percentage,
    };
}
