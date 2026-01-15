export const PROJECTS = [
  "Viso Internal",
  "Client A",
  "Client B",
  "Personal Development",
] as const;

export type Project = (typeof PROJECTS)[number];
