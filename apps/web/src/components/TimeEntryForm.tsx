"use client";

import { useMemo, useState } from "react";
import { PROJECTS } from "@/types";
import { createEntry } from "@/lib/api";

type Props = { onSaved: () => void };
type Project = (typeof PROJECTS)[number];

function todayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isProject(value: string): value is Project {
  return (PROJECTS as readonly string[]).includes(value);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function TimeEntryForm({ onSaved }: Props) {
  const defaultDate = useMemo(() => todayIso(), []);
  const [date, setDate] = useState(defaultDate);
  const [project, setProject] = useState<Project>(PROJECTS[0]);
  const [hours, setHours] = useState<string>("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const hoursNum = Number(hours);
  const progress = clamp((Number.isFinite(hoursNum) ? hoursNum : 0) / 24, 0, 1);
  const progressPct = Math.round(progress * 100);

  function handleProjectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (isProject(value)) {
      setProject(value);
      return;
    }
    setError("Invalid project selected.");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const hn = Number(hours);
    if (!date || !project || !description.trim() || !hours) {
      setError("All fields are required.");
      return;
    }
    if (!Number.isFinite(hn) || hn <= 0) {
      setError("Hours must be a positive number.");
      return;
    }

    setSaving(true);
    try {
      await createEntry({
        date,
        project,
        hours: hn,
        description: description.trim(),
      });
      setHours("");
      setDescription("");
      onSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went sideways.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border-2 border-slate-300 bg-white shadow-md">
      {/* Header */}
      <div className="rounded-t-2xl border-b-2 border-slate-300 bg-slate-50 px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Time Entry</h2>
            <p className="mt-1 text-sm text-slate-600">
              Capture work fast. Keep totals honest. выглядеть как взрослое приложение ✅
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Daily cap: 24h
            </span>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              {progressPct}% (this entry)
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Entry size</span>
            <span>{Number.isFinite(hoursNum) ? hoursNum.toFixed(2) : "0.00"}h</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full border border-slate-300 bg-white">
            <div
              className="h-full rounded-full bg-slate-900 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <form onSubmit={onSubmit} className="px-6 py-6">
        {error && (
          <div className="mb-5 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Date */}
          <div className="md:col-span-4">
            <label className="text-sm font-semibold text-slate-800">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
            />
          </div>

          {/* Project */}
          <div className="md:col-span-5">
            <label className="text-sm font-semibold text-slate-800">Project</label>
            <select
              value={project}
              onChange={handleProjectChange}
              className="mt-1 w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
            >
              {PROJECTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <div className="mt-2 flex flex-wrap gap-2">
              {PROJECTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProject(p as Project)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    project === p
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-900"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div className="md:col-span-3">
            <label className="text-sm font-semibold text-slate-800">Hours</label>
            <input
              inputMode="decimal"
              placeholder="e.g. 2.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="mt-1 w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
            />
            <p className="mt-2 text-xs font-medium text-slate-600">
              Positive number. Backend enforces 24h/day.
            </p>
          </div>

          {/* Description */}
          <div className="md:col-span-12">
            <label className="text-sm font-semibold text-slate-800">
              Work description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you do?"
              className="mt-1 w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save entry"}
          </button>
        </div>
      </form>
    </section>
  );
}
