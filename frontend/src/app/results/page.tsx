"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    apiFetch("/api/results/me").then(setResults);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">My Results</h1>

      {results.length === 0 ? (
        <p className="text-gray-500">No results published yet.</p>
      ) : (
        results.map((r) => (
          <div
            key={r.attempt_id}
            className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl mb-4 shadow-lg flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold text-white">{r.title}</h2>
              <p className="text-sm text-gray-400">
                Completed on {new Date(r.end_time).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Score</p>
              <p className="text-2xl font-bold text-yellow-500">
                {r.final_score} <span className="text-sm text-gray-500 font-normal">/ {r.total_marks}</span>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
