import { Router } from "express";
import { eq, and, isNull, inArray, sql } from "drizzle-orm";
import { issues } from "@forge/db/schema";
import {
  createIssueSchema,
  updateIssueSchema,
  bulkUpdateIssuesSchema,
} from "@forge/shared/validators";
import { getDb } from "@forge/db/client";

const router = Router();

// GET /api/issues?companyId=xxx&status=in_progress&assigneeId=xxx&projectId=xxx
router.get("/", async (req, res, next) => {
  try {
    const db = getDb();
    const { companyId, status, assigneeId, projectId, goalId } = req.query as Record<
      string,
      string | undefined
    >;

    const conditions = [];
    if (companyId) conditions.push(eq(issues.companyId, companyId));
    if (status) conditions.push(eq(issues.status, status as any));
    if (assigneeId) conditions.push(eq(issues.assigneeId, assigneeId));
    if (projectId) conditions.push(eq(issues.projectId, projectId));
    if (goalId) conditions.push(eq(issues.goalId, goalId));

    const result =
      conditions.length > 0
        ? await db
            .select()
            .from(issues)
            .where(and(...conditions))
            .orderBy(issues.createdAt)
        : await db.select().from(issues).orderBy(issues.createdAt);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/issues/:id
router.get("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const [issue] = await db
      .select()
      .from(issues)
      .where(eq(issues.id, req.params.id));
    if (!issue) {
      res.status(404).json({ error: "Issue not found" });
      return;
    }
    res.json(issue);
  } catch (err) {
    next(err);
  }
});

// POST /api/issues
router.post("/", async (req, res, next) => {
  try {
    const db = getDb();
    const input = createIssueSchema.parse(req.body);

    // Auto-increment number within company
    const [maxRow] = await db
      .select({ n: sql<number>`COALESCE(MAX(number), 0)` })
      .from(issues)
      .where(eq(issues.companyId, input.companyId));
    const number = (maxRow?.n ?? 0) + 1;

    const [created] = await db
      .insert(issues)
      .values({ ...input, number })
      .returning();
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/issues/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const input = updateIssueSchema.parse(req.body);
    const [updated] = await db
      .update(issues)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(issues.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Issue not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/issues/:id/checkout — atomic execution lock
router.post("/:id/checkout", async (req, res, next) => {
  try {
    const db = getDb();
    const { runId } = req.body as { runId: string };
    if (!runId) {
      res.status(400).json({ error: "runId is required" });
      return;
    }

    const [updated] = await db
      .update(issues)
      .set({
        checkoutRunId: runId,
        executionLockedAt: new Date(),
        status: "in_progress",
        updatedAt: new Date(),
      })
      .where(
        and(eq(issues.id, req.params.id), isNull(issues.checkoutRunId))
      )
      .returning();

    if (!updated) {
      res.status(409).json({ error: "Issue already checked out" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/issues/:id/checkin — release execution lock
router.post("/:id/checkin", async (req, res, next) => {
  try {
    const db = getDb();
    const { status } = req.body as { status?: string };
    const [updated] = await db
      .update(issues)
      .set({
        checkoutRunId: null,
        executionLockedAt: null,
        ...(status ? { status: status as any } : {}),
        updatedAt: new Date(),
      })
      .where(eq(issues.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Issue not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/issues/bulk — bulk update (Linear-style)
router.post("/bulk", async (req, res, next) => {
  try {
    const db = getDb();
    const { issueIds, updates } = bulkUpdateIssuesSchema.parse(req.body);
    const updated = await db
      .update(issues)
      .set({ ...updates, updatedAt: new Date() })
      .where(inArray(issues.id, issueIds))
      .returning();
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/issues/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    await db.delete(issues).where(eq(issues.id, req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
