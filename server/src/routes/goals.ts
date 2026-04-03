import { Router } from "express";
import { eq } from "drizzle-orm";
import { goals } from "@forge/db/schema";
import { getDb } from "@forge/db/client";
import { z } from "zod";

const router = Router();

const createGoalSchema = z.object({
  companyId: z.string().uuid(),
  title: z.string().min(1).max(300),
  description: z.string().optional(),
  level: z.string().optional(),
  parentId: z.string().uuid().optional(),
  ownerAgentId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  targetDate: z.string().datetime().optional(),
});

const updateGoalSchema = createGoalSchema.partial().omit({ companyId: true });

// GET /api/goals?companyId=xxx
router.get("/", async (req, res, next) => {
  try {
    const db = getDb();
    const { companyId } = req.query as { companyId?: string };
    const result = companyId
      ? await db.select().from(goals).where(eq(goals.companyId, companyId))
      : await db.select().from(goals);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/goals/:id
router.get("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const [goal] = await db.select().from(goals).where(eq(goals.id, req.params.id));
    if (!goal) {
      res.status(404).json({ error: "Goal not found" });
      return;
    }
    res.json(goal);
  } catch (err) {
    next(err);
  }
});

// POST /api/goals
router.post("/", async (req, res, next) => {
  try {
    const db = getDb();
    const input = createGoalSchema.parse(req.body);
    const [created] = await db.insert(goals).values(input as any).returning();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/goals/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const input = updateGoalSchema.parse(req.body);
    const [updated] = await db
      .update(goals)
      .set({ ...input, updatedAt: new Date() } as any)
      .where(eq(goals.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Goal not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/goals/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    await db.delete(goals).where(eq(goals.id, req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
