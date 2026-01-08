"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

export default function AssessmentAttemptsPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    apiFetch(`/api/admin/assessments/${assessmentId}/attempts`)
      .then(setAttempts);
  }, [assessmentId]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <h1 className="text-xl font-bold mb-6">Attempts</h1>

      {attempts.map((a) => (
        <div
          key={a.id}
          className="p-4 border border-neutral-800 rounded mb-4 flex justify-between"
        >
          <div>
            <p>{a.email}</p>
            <p className="text-sm text-gray-400">{a.status}</p>
          </div>

          <Link
            href={`/admin/attempts/${a.id}`}
            className="text-yellow-400"
          >
            Review →
          </Link>
        </div>
      ))}
    </div>
  );
}
