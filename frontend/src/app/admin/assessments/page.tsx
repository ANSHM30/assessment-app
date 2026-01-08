"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/api/admin/assessments").then(setAssessments);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <h1 className="text-xl font-bold mb-6">Assessments</h1>

      {assessments.map((a) => (
        <div
          key={a.id}
          className="p-4 border border-neutral-800 rounded mb-4 flex justify-between"
        >
          <div>
            <p className="font-semibold">{a.title}</p>
            <p className="text-sm text-gray-400">{a.status}</p>
          </div>

          <Link
            href={`/admin/assessments/${a.id}/attempts`}
            className="text-yellow-400"
          >
            View Attempts →
          </Link>
        </div>
      ))}
    </div>
  );
}
