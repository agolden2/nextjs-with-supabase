import { Router } from "express";
import { eq } from "drizzle-orm";
import { labels } from "@forge/db/schema";
import { getDb } from "@forge/db/client";
import { z } from "zod";

const router = Router();

const createLabelSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  description: z.string().optional(),
});

// GET /api/labels?companyId=xxx
router.get("/", async (req, res, next) => {
  try {
    const db = getDb();
    const { companyId } = req.query as { companyId?: string };
    const result = companyId
      ? await db.select().from(labels).where(eq(labels.companyId, companyId))
      : await db.select().from(labels);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/labels
router.post("/", async (req, res, next) => {
  try {
    const db = getDb();
    const input = createLabelSchema.parse(req.body);
    const [created] = await db.insert(labels).values(input as any).returning();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/labels/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const [updated] = await db
      .update(labels)
      .set(req.body)
      .where(eq(labels.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Label not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/labels/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    await db.delete(labels).where(eq(labels.id, req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
