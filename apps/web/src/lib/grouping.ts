import type { TimeEntry } from "@/types";

export type GroupedEntries = {
  date: string;
  totalHours: number;
  entries: TimeEntry[];
};

export function groupByDate(entries: TimeEntry[]): {
  groups: GroupedEntries[];
  grandTotal: number;
} {
  const map = new Map<string, TimeEntry[]>();

  for (const e of entries) {
    const arr = map.get(e.date) ?? [];
    arr.push(e);
    map.set(e.date, arr);
  }

  const groups: GroupedEntries[] = Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([date, list]) => {
      const totalHours = list.reduce((sum, x) => sum + x.hours, 0);
      return { date, totalHours, entries: list };
    });

  const grandTotal = groups.reduce((sum, g) => sum + g.totalHours, 0);

  return { groups, grandTotal };
}
