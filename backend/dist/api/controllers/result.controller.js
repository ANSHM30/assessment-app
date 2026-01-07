"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyResults = getMyResults;
const db_1 = __importDefault(require("../../config/db"));
async function getMyResults(req, res) {
    try {
        const userId = req.user.userId;
        const result = await db_1.default.query(`
      SELECT
        a.id AS attempt_id,
        ass.title,
        a.final_score,
        ass.total_marks,
        a.result,
        a.end_time
      FROM attempts a
      JOIN assessments ass ON ass.id = a.assessment_id
      WHERE a.user_id = $1
        AND a.is_published = true
      ORDER BY a.end_time DESC
      `, [userId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error("❌ getMyResults error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
