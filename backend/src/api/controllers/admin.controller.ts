import { Request, Response } from "express";
import pool from "../../config/db";
import { calculateFinalScore } from "../../services/scoring.service";
import { finalizeAttemptIfComplete } from "../../services/finalizeAttempt.service";

/**
 * GET /api/admin/assessments
 * List all assessments
 */
export async function getAssessments(req: Request, res: Response) {
  const result = await pool.query(
    `SELECT id, title, status, created_at
     FROM assessments
     ORDER BY created_at DESC`
  );

  res.json(result.rows);
}

/**
 * GET /api/admin/assessments/:assessmentId/attempts
 * List all attempts for an assessment
 */
export async function getAttemptsByAssessment(req: Request, res: Response) {
  const { assessmentId } = req.params;

  const result = await pool.query(
    `SELECT 
        a.id,
        u.email,
        a.status,
        a.start_time,
        a.end_time,
        a.score
     FROM attempts a
     JOIN users u ON u.id = a.user_id
     WHERE a.assessment_id = $1
     ORDER BY a.start_time DESC`,
    [assessmentId]
  );

  res.json(result.rows);
}

/**
 * GET /api/admin/attempts/:attemptId/violations
 * View violations for an attempt
 */
export async function getViolationsByAttempt(req: Request, res: Response) {
  const { attemptId } = req.params;

  const result = await pool.query(
    `SELECT violation_type, created_at
FROM violations
WHERE attempt_id = $1
ORDER BY created_at ASC
`,
    [attemptId]
  );

  res.json(result.rows);
}

/**
 * GET /api/admin/attempts/:attemptId
 * Attempt summary
 */
export async function getAttemptSummary(req: Request, res: Response) {
  const { attemptId } = req.params;

  const result = await pool.query(
    `SELECT 
        a.id,
        u.email,
        a.status,
        a.start_time,
        a.end_time,
        COUNT(v.id) AS violations
     FROM attempts a
     JOIN users u ON u.id = a.user_id
     LEFT JOIN violations v ON v.attempt_id = a.id
     WHERE a.id = $1
     GROUP BY a.id, u.email`,
    [attemptId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Attempt not found" });
  }

  res.json(result.rows[0]);
}
export async function getDescriptiveAnswers(req: Request, res: Response) {
  const { attemptId } = req.params;

  const result = await pool.query(
    `
    SELECT 
      a.id,
      q.question_text,
      a.answer,
      q.marks
    FROM answers a
    JOIN questions q ON q.id = a.question_id
    WHERE a.attempt_id = $1
      AND q.question_type = 'DESCRIPTIVE'
    `,
    [attemptId]
  );

  res.json(result.rows);
}

/**
 * POST /api/admin/grade-answer
 * Grade a descriptive answer and recalculate final score
 */
export async function gradeDescriptiveAnswer(req: Request, res: Response) {
  try {
    const { answerId, marks } = req.body;

    if (!answerId || marks === undefined) {
      return res.status(400).json({ message: "answerId and marks are required" });
    }

    // 1️⃣ Grade the answer
    const result = await pool.query(
      `
      UPDATE answers
      SET marks_obtained = $1,
          is_graded = true
      WHERE id = $2
      RETURNING attempt_id
      `,
      [marks, answerId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const attemptId = result.rows[0].attempt_id;

    // 2️⃣ Auto-finalize if this was the last pending answer
    const finalization = await finalizeAttemptIfComplete(attemptId);

    res.json({
      message: "Answer graded successfully",
      finalized: finalization.finalized,
      result: finalization.result ?? null,
    });
  } catch (error) {
    console.error("❌ gradeDescriptiveAnswer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function publishResult(req: Request, res: Response) {
  try {
    const { attemptId } = req.params;

    // 1️⃣ Ensure attempt exists & is finalized
    const attempt = await pool.query(
      `
      SELECT id, result, is_published
      FROM attempts
      WHERE id = $1
      `,
      [attemptId]
    );

    if (attempt.rowCount === 0) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    const row = attempt.rows[0];

    if (!row.result) {
      return res.status(409).json({
        message: "Attempt not finalized yet",
      });
    }

    if (row.is_published) {
      return res.status(409).json({
        message: "Result already published",
      });
    }

    // 2️⃣ Publish result
    await pool.query(
      `
      UPDATE attempts
      SET is_published = true
      WHERE id = $1
      `,
      [attemptId]
    );

    res.json({
      message: "Result published successfully",
    });
  } catch (error) {
    console.error("❌ publishResult error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

