import type { TimeEntry } from "@/types";
import { groupByDate } from "@/lib/grouping";

export function EntryHistory({ entries }: { entries: TimeEntry[] }) {
  const { groups, grandTotal } = groupByDate(entries);

  return (
    <section className="rounded-2xl border-2 border-slate-300 bg-white shadow-md">
      <div className="rounded-t-2xl border-b-2 border-slate-300 bg-slate-50 px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Entry History</h2>
            <p className="mt-1 text-sm text-slate-600">
              Grouped by date, with daily totals and grand total.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Entries: {entries.length}
            </span>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              Grand total: {grandTotal.toFixed(2)}h
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {groups.length === 0 ? (
          <div className="rounded-xl border-2 border-slate-300 bg-white px-4 py-4 text-sm text-slate-700">
            No entries yet. Add one above.
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((g) => (
              <div key={g.date} className="rounded-2xl border-2 border-slate-300 bg-white">
                <div className="flex flex-col gap-2 border-b-2 border-slate-300 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-semibold text-slate-900">{g.date}</div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      {g.entries.length} entries
                    </span>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                      Total: {g.totalHours.toFixed(2)}h
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-700">
                        <th className="border-b-2 border-slate-300 px-4 py-3">Project</th>
                        <th className="border-b-2 border-slate-300 px-4 py-3 text-right">Hours</th>
                        <th className="border-b-2 border-slate-300 px-4 py-3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.entries.map((e, idx) => (
                        <tr key={e.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                          <td className="border-b border-slate-300 px-4 py-3">
                            <span className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                              {e.project}
                            </span>
                          </td>
                          <td className="border-b border-slate-300 px-4 py-3 text-right text-sm font-semibold text-slate-900">
                            {e.hours.toFixed(2)}
                          </td>
                          <td className="border-b border-slate-300 px-4 py-3 text-sm text-slate-800">
                            {e.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 text-xs font-medium text-slate-600">
                  <span>Daily subtotal is calculated client-side.</span>
                  <span className="rounded-full border border-slate-300 bg-white px-3 py-1">
                    Status: Logged ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
