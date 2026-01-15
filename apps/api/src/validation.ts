import { z } from "zod";
import { PROJECTS } from "./projects";

export const createEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  project: z.enum(PROJECTS),
  hours: z.number().positive("Hours must be > 0"),
  description: z.string().min(1, "Description is required"),
});

export type CreateEntryDto = z.infer<typeof createEntrySchema>;
