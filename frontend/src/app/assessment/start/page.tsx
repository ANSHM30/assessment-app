"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { attemptService } from "@/services/attempt.service";
import { enterFullscreen } from "@/hooks/useFullscreen";

export default function StartAssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const ASSESSMENT_ID = 1; // backend assessment id

  async function startAssessment() {
    setLoading(true);
    try {
      enterFullscreen();
      const res = await attemptService.start(ASSESSMENT_ID);
      router.push(`/assessment/attempt/${res.attemptId}`);
    } catch (err) {
      alert("Unable to start assessment");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          Ready to Begin?
        </h1>

        <p className="text-gray-400 mb-6">
          Once started, fullscreen mode will be enforced and the timer begins.
        </p>

        <button
          onClick={startAssessment}
          disabled={loading}
          className="bg-yellow-500 text-black px-6 py-3 rounded font-semibold hover:bg-yellow-400 transition"
        >
          {loading ? "Starting..." : "Start Assessment"}
        </button>
      </div>
    </div>
  );
}
