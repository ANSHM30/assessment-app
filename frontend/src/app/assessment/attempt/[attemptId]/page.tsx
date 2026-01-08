"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { attemptService } from "@/services/attempt.service";
import { useViolation } from "@/hooks/useViolation";
import { useTimer } from "@/hooks/useTimer";
import { Question } from "@/types";

export default function AttemptPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const router = useRouter();
  const id = Number(attemptId);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useViolation(id);

  // 30 minutes example
  const timeLeft = useTimer(30 * 60, async () => {
    await attemptService.submit(id);
    router.push("/results");
  });

  useEffect(() => {
    attemptService.getQuestions(id).then(setQuestions);
  }, [id]);

  async function saveAnswer(qId: number, value: string) {
    setAnswers({ ...answers, [qId]: value });
    await attemptService.saveAnswer(id, {
      questionId: qId,
      answer: value,
    });
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-xl font-bold">Assessment</h1>
          <span className="text-yellow-400">
            Time Left: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>

        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="mb-8 p-4 border border-neutral-800 rounded"
          >
            <p className="mb-3 font-semibold">
              {idx + 1}. {q.question_text}
            </p>

            {q.question_type === "MCQ" ? (
              q.options?.map((opt) => (
                <label key={opt} className="block mb-2">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[q.id] === opt}
                    onChange={() => saveAnswer(q.id, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))
            ) : (
              <textarea
                className="w-full p-3 bg-neutral-800 rounded"
                rows={4}
                onBlur={(e) => saveAnswer(q.id, e.target.value)}
              />
            )}
          </div>
        ))}

        <button
          onClick={async () => {
            await attemptService.submit(id);
            router.push("/results");
          }}
          className="bg-red-500 px-6 py-3 rounded font-semibold"
        >
          Submit Assessment
        </button>
      </div>
    </div>
  );
}
