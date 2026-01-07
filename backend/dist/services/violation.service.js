"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAutoSubmit = checkAutoSubmit;
const db_1 = __importDefault(require("../config/db"));
async function checkAutoSubmit(attemptId) {
    const result = await db_1.default.query(`SELECT violation_type, COUNT(*) as count
     FROM violations
     WHERE attempt_id = $1
     GROUP BY violation_type`, [attemptId]);
    let totalViolations = 0;
    for (const row of result.rows) {
        const count = Number(row.count);
        totalViolations += count;
        // 🚨 Immediate auto-submit for auto-typer
        if (row.violation_type === "AUTO_TYPER_DETECTED") {
            return { autoSubmit: true, reason: "AUTO_TYPER_DETECTED" };
        }
        // 🚨 Fullscreen exit rule (3 strikes)
        if (row.violation_type === "FULLSCREEN_EXIT" && count >= 3) {
            return { autoSubmit: true, reason: "FULLSCREEN_EXIT_LIMIT" };
        }
        // 🚨 Tab switching rule (3 strikes)
        if (row.violation_type === "TAB_SWITCH" && count >= 3) {
            return { autoSubmit: true, reason: "TAB_SWITCH_LIMIT" };
        }
    }
    // 🚨 Total violations rule
    if (totalViolations >= 5) {
        return { autoSubmit: true, reason: "TOTAL_VIOLATION_LIMIT" };
    }
    return { autoSubmit: false };
}
