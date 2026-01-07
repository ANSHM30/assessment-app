import pool from "../config/db";

export async function autoGradeMCQs(attemptId: number) {
  const result = await pool.query(
    `
    SELECT 
      a.id AS answer_id,
      q.correct_answer,
      q.marks,
      a.answer
    FROM answers a
    JOIN questions q ON q.id = a.question_id
    WHERE a.attempt_id = $1
      AND q.question_type = 'MCQ'
      AND a.is_graded = false
    `,
    [attemptId]
  );

  let total = 0;

  for (const row of result.rows) {
    const isCorrect = row.answer === row.correct_answer;
    const marksObtained = isCorrect ? Number(row.marks) : 0;

    total += marksObtained;

    await pool.query(
      `
      UPDATE answers
      SET marks_obtained = $1,
          is_graded = true
      WHERE id = $2
      `,
      [marksObtained, row.answer_id]
    );
  }

  return total;
}

export async function calculateFinalScore(attemptId: number) {
  const result = await pool.query(
    `
    SELECT COALESCE(SUM(marks_obtained), 0) AS score
    FROM answers
    WHERE attempt_id = $1
    `,
    [attemptId]
  );

  const score = Number(result.rows[0].score);

  await pool.query(
    `
    UPDATE attempts
    SET final_score = $1
    WHERE id = $2
    `,
    [score, attemptId]
  );

  return score;
}
