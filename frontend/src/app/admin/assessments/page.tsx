"use client";

import { useEffect, useState } from "react";
import { getAssessments } from "@/services/admin.service";
import Link from "next/link";

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    getAssessments().then(setAssessments);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Assessments</h1>
        <Link
          href="/admin/assessments/new"
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-yellow-500/10"
        >
          + Create Assessment
        </Link>
      </div>

      {assessments.map((a) => (
        <div
          key={a.id}
          className="p-4 border border-neutral-800 rounded mb-4 flex justify-between"
        >
          <div>
            <p className="font-semibold">{a.title}</p>
            <div className="flex gap-2 items-center mt-1">
              <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded text-neutral-400">
                Code: <span className="text-yellow-500 font-mono font-bold uppercase">{a.code}</span>
              </span>
              <span className="text-xs text-gray-400">| {a.status}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href={`/admin/assessments/${a.id}/edit`}
              className="text-gray-400 hover:text-white"
            >
              Manage Questions
            </Link>
            <Link
              href={`/admin/assessments/${a.id}/attempts`}
              className="text-yellow-400"
            >
              View Attempts →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
