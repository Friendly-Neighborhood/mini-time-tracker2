"use client";

import { useEffect, useState } from "react";
import type { TimeEntry } from "@/types";
import { fetchEntries } from "@/lib/api";
import { TimeEntryForm } from "@/components/TimeEntryForm";
import { EntryHistory } from "@/components/EntryHistory";

export default function HomePage() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchEntries();
      setEntries(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
<main className="min-h-screen bg-slate-50">
  <div className="mx-auto max-w-4xl px-4 py-10">
    <h1 className="text-2xl font-bold text-slate-900">Mini Time Tracker</h1>
    <p className="mt-1 text-sm text-slate-500">
      Simple tracker with daily totals and history.
    </p>

    <div className="mt-6 grid gap-6">
      <TimeEntryForm onSaved={load} />
      {!loading && <EntryHistory entries={entries} />}
    </div>
  </div>
</main>

  );
}
