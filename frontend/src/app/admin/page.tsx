"use client";

import Link from "next/link";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminPage() {
  const { loading } = useAdmin();

  if (loading) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Link
        href="/admin/assessments"
        className="inline-block bg-yellow-500 text-black px-6 py-3 rounded font-semibold"
      >
        View Assessments
      </Link>
    </div>
  );
}
