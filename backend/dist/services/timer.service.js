"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceTimeLimit = enforceTimeLimit;
const db_1 = __importDefault(require("../config/db"));
/**
 * Checks if an attempt has exceeded its allowed duration.
 * If yes → auto-submit.
 */
async function enforceTimeLimit(attemptId) {
    const result = await db_1.default.query(`
    SELECT 
      a.id,
      a.status,
      a.start_time,
      ass.duration_minutes
    FROM attempts a
    JOIN assessments ass ON ass.id = a.assessment_id
    WHERE a.id = $1
    `, [attemptId]);
    if (result.rowCount === 0)
        return { expired: false };
    const attempt = result.rows[0];
    if (attempt.status !== "IN_PROGRESS") {
        return { expired: false };
    }
    const startTime = new Date(attempt.start_time).getTime();
    const durationMs = attempt.duration_minutes * 60 * 1000;
    const now = Date.now();
    if (now >= startTime + durationMs) {
        // ⏱️ Time expired → auto-submit
        await db_1.default.query(`
      UPDATE attempts
      SET status = 'AUTO_SUBMITTED',
          end_time = NOW()
      WHERE id = $1 AND status = 'IN_PROGRESS'
      `, [attemptId]);
        return { expired: true };
    }
    return { expired: false };
}
