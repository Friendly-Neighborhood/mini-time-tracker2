export type TimeEntry = {
  id: string;
  date: string;        // YYYY-MM-DD
  project: string;
  hours: number;
  description: string;
  createdAt: string;
};

export const PROJECTS = [
  "Viso Internal",
  "Client A",
  "Client B",
  "Personal Development",
] as const;
