import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { createEntrySchema } from "./validation";

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

// Create entry
app.post("/entries", async (req, res) => {
  const parsed = createEntrySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      issues: parsed.error.issues,
    });
  }

  const dto = parsed.data;

  // Sum existing hours for that date
  const aggregate = await prisma.timeEntry.aggregate({
    where: { date: dto.date },
    _sum: { hours: true },
  });

  const existing = aggregate._sum.hours ?? 0;
  const nextTotal = existing + dto.hours;

  if (nextTotal > 24) {
    return res.status(409).json({
      message: `Daily limit exceeded. Existing: ${existing}, attempted add: ${dto.hours}, would become: ${nextTotal}. Max is 24.`,
      code: "DAILY_HOURS_LIMIT",
    });
  }

  const created = await prisma.timeEntry.create({
    data: {
      date: dto.date,
      project: dto.project,
      hours: dto.hours,
      description: dto.description,
    },
  });

  return res.status(201).json(created);
});

// List entries (sorted)
app.get("/entries", async (_req, res) => {
  const entries = await prisma.timeEntry.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  return res.json(entries);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
