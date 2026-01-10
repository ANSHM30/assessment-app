import { Request, Response } from "express";
import pool from "../../config/db";
import { AuthRequest } from "../middlewares/auth.middleware";

export async function getMyResults(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId;

    const result = await pool.query(
      `
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
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("❌ getMyResults error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
