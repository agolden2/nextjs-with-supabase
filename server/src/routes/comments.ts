import { Router } from "express";
import { eq } from "drizzle-orm";
import { comments } from "@forge/db/schema";
import { getDb } from "@forge/db/client";
import { z } from "zod";

const router = Router();

const createCommentSchema = z.object({
  companyId: z.string().uuid(),
  issueId: z.string().uuid(),
  body: z.string().min(1),
  authorAgentId: z.string().uuid().optional(),
  authorUserId: z.string().optional(),
});

// GET /api/comments?issueId=xxx
router.get("/", async (req, res, next) => {
  try {
    const db = getDb();
    const { issueId } = req.query as { issueId?: string };
    const result = issueId
      ? await db.select().from(comments).where(eq(comments.issueId, issueId))
      : await db.select().from(comments);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/comments
router.post("/", async (req, res, next) => {
  try {
    const db = getDb();
    const input = createCommentSchema.parse(req.body);
    const [created] = await db.insert(comments).values(input as any).returning();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/comments/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const { body } = req.body as { body: string };
    const [updated] = await db
      .update(comments)
      .set({ body, updatedAt: new Date() })
      .where(eq(comments.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/comments/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    await db.delete(comments).where(eq(comments.id, req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
