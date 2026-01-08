"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function AttemptReviewPage() {
  const { id } = useParams<{ id: string }>();
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    apiFetch(`/api/admin/attempts/${id}/descriptive`)
      .then(setAnswers);
  }, [id]);

  async function grade(answerId: number, marks: number) {
    await apiFetch("/api/admin/answers/grade", {
      method: "POST",
      body: JSON.stringify({ answerId, marks }),
    });

    alert("Graded");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <h1 className="text-xl font-bold mb-6">Descriptive Answers</h1>

      {answers.map((a) => (
        <div
          key={a.id}
          className="border border-neutral-800 rounded p-4 mb-6"
        >
          <p className="font-semibold mb-2">{a.question_text}</p>
          <p className="text-gray-300 mb-4">{a.answer}</p>

          <button
            onClick={() => grade(a.id, a.marks)}
            className="bg-yellow-500 text-black px-4 py-2 rounded"
          >
            Give Full Marks ({a.marks})
          </button>
        </div>
      ))}
    </div>
  );
}
