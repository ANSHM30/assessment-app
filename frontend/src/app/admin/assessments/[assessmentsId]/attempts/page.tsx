"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAttemptsByAssessment, publishResult } from "@/services/admin.service";

import Link from "next/link";

export default function AdminAssessmentAttemptsPage() {
  const params = useParams();

  const rawAssessmentId = params.assessmentsId;
  const assessmentId = Array.isArray(rawAssessmentId)
    ? rawAssessmentId[0]
    : rawAssessmentId;

  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<number | null>(null);

  const loadAttempts = async () => {
    if (!assessmentId) return;
    try {
      const data = await getAttemptsByAssessment(assessmentId);
      setAttempts(data);
    } catch (err) {
      console.error("Failed to load attempts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttempts();
  }, [assessmentId]);

  const handlePublish = async (attemptId: number) => {
    if (!confirm("Are you sure you want to publish this result? This will make it visible to the candidate.")) return;
    
    setPublishing(attemptId);
    try {
      await publishResult(attemptId);
      await loadAttempts();
    } catch (err) {
      console.error("Failed to publish result", err);
      alert("Failed to publish result");
    } finally {
      setPublishing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-white text-lg animate-pulse">Loading attempts...</p>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
        <p className="text-xl mb-4 text-gray-400">No attempts found for this assessment.</p>
        <Link href="/admin/assessments" className="text-yellow-500 hover:underline">
          ← Back to Assessments
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin/assessments" className="text-gray-400 hover:text-white transition-colors text-sm mb-2 block">
              ← Back to Assessments
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-white">Assessment Attempts</h1>
            <p className="text-gray-400 mt-1 text-sm">Review student performance and grade descriptive answers.</p>
          </div>
        </div>

        <div className="grid gap-4">
          {attempts.map((a) => (
            <div
              key={a.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between transition-all hover:border-neutral-700 shadow-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono text-gray-500 bg-neutral-800 px-2 py-0.5 rounded">ID: {a.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    a.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {a.status}
                  </span>
                  {a.is_published && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-blue-500/10 text-blue-400">
                      Published
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-medium text-white mb-1">{a.email}</h3>
                <div className="flex gap-4 text-xs text-gray-400">
                  <p>Started: {new Date(a.start_time).toLocaleString()}</p>
                  {a.end_time && <p>Ended: {new Date(a.end_time).toLocaleString()}</p>}
                </div>
              </div>

              <div className="mt-4 md:mt-0 md:ml-8 flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-0.5">Score</p>
                  <p className={`text-xl font-bold ${
                    a.result === 'PASS' ? 'text-green-400' : a.result === 'FAIL' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {a.final_score ?? '-'}
                    {a.result && <span className="ml-1 text-xs opacity-60">({a.result})</span>}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/attempts/${a.id}`}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-neutral-700"
                  >
                    Grade Details
                  </Link>
                  <Link
                    href={`/admin/attempts/${a.id}/results`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-yellow-500/10"
                  >
                    View Results
                  </Link>
                  {a.status === 'COMPLETED' && !a.is_published && (
                    <button
                      onClick={() => handlePublish(a.id)}
                      disabled={publishing === a.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/10 disabled:opacity-50"
                    >
                      {publishing === a.id ? "Publishing..." : "Publish Result"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
