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

      {results.map((r) => (
        <div
          key={r.attempt_id}
          className="p-4 border border-neutral-800 rounded mb-4"
        >
          <p>Status: {r.result}</p>
          <p>Score: {r.final_score}</p>
        </div>
      ))}
    </div>
  );
}
