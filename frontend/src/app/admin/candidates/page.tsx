"use client";

import { useEffect, useState } from "react";
import { getCandidates, addCandidate } from "@/services/admin.service";
import Link from "next/link";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [adding, setAdding] = useState(false);

  const loadCandidates = async () => {
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch (err) {
      console.error("Failed to load candidates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setAdding(true);
    try {
      await addCandidate({ email, full_name: fullName });
      setEmail("");
      setFullName("");
      await loadCandidates();
      alert("Candidate added successfully");
    } catch (err: any) {
      console.error("Failed to add candidate", err);
      alert(err.message || "Failed to add candidate");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-white text-lg animate-pulse">Loading candidates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-gray-400 hover:text-white mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-8 text-white">Manage Candidates</h1>

        {/* Add Candidate Form */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-500">Add New Candidate</h2>
          <form onSubmit={handleAddCandidate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@example.com"
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={adding}
                className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add Candidate"}
              </button>
            </div>
          </form>
        </div>

        {/* Candidates List */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-800 border-b border-neutral-700 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Full Name</th>
                <th className="px-6 py-4 font-bold">Added On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No candidates found.
                  </td>
                </tr>
              ) : (
                candidates.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{c.email}</td>
                    <td className="px-6 py-4 text-gray-300">{c.full_name || "-"}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
