import type { TimeEntry } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

export async function fetchEntries(): Promise<TimeEntry[]> {
  const res = await fetch(`${API_BASE}/entries`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load entries");
  return res.json();
}

export async function createEntry(payload: {
  date: string;
  project: string;
  hours: number;
  description: string;
}): Promise<TimeEntry> {
  const res = await fetch(`${API_BASE}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) return res.json();

  // Try to surface backend error nicely
  const err = await res.json().catch(() => ({}));
  const message = err?.message ?? "Failed to save";
  throw new Error(message);
}
