import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { approvals } from "@forge/db/schema";
import { getDb } from "@forge/db/client";
import { broadcast } from "../realtime/ws-server.js";
import { makeEvent } from "../realtime/events.js";
import { logActivity } from "../services/activity.js";
import { z } from "zod";

const router = Router();

const createApprovalSchema = z.object({
  companyId: z.string().uuid(),
  type: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  requestedByAgentId: z.string().uuid().optional(),
  payload: z.record(z.unknown()).optional(),
});

// GET /api/approvals?companyId=xxx&status=pending
router.get("/", async (req, res, next) => {
  try {
    const db = getDb();
    const { companyId, status } = req.query as { companyId?: string; status?: string };
    const conditions = [];
    if (companyId) conditions.push(eq(approvals.companyId, companyId));
    if (status) conditions.push(eq(approvals.status, status as any));

    const result =
      conditions.length > 0
        ? await db
            .select()
            .from(approvals)
            .where(and(...conditions))
            .orderBy(approvals.createdAt)
        : await db.select().from(approvals).orderBy(approvals.createdAt);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/approvals
router.post("/", async (req, res, next) => {
  try {
    const db = getDb();
    const input = createApprovalSchema.parse(req.body);
    const [created] = await db.insert(approvals).values(input as any).returning();

    broadcast(makeEvent("approval:created", created.companyId, created));
    logActivity({
      companyId: created.companyId,
      entityType: "approval",
      entityId: created.id,
      action: "created",
      after: created as any,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// POST /api/approvals/:id/approve
router.post("/:id/approve", async (req, res, next) => {
  try {
    const db = getDb();
    const { reviewedByUserId } = req.body as { reviewedByUserId?: string };
    const [updated] = await db
      .update(approvals)
      .set({
        status: "approved",
        reviewedByUserId,
        resolvedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(approvals.id, req.params.id), eq(approvals.status, "pending")))
      .returning();
    if (!updated) {
      res.status(409).json({ error: "Approval not found or not pending" });
      return;
    }

    broadcast(makeEvent("approval:resolved", updated.companyId, updated));
    logActivity({
      companyId: updated.companyId,
      entityType: "approval",
      entityId: updated.id,
      action: "approved",
      after: { reviewedByUserId } as any,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/approvals/:id/reject
router.post("/:id/reject", async (req, res, next) => {
  try {
    const db = getDb();
    const { reviewedByUserId } = req.body as { reviewedByUserId?: string };
    const [updated] = await db
      .update(approvals)
      .set({
        status: "rejected",
        reviewedByUserId,
        resolvedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(approvals.id, req.params.id), eq(approvals.status, "pending")))
      .returning();
    if (!updated) {
      res.status(409).json({ error: "Approval not found or not pending" });
      return;
    }

    broadcast(makeEvent("approval:resolved", updated.companyId, updated));
    logActivity({
      companyId: updated.companyId,
      entityType: "approval",
      entityId: updated.id,
      action: "rejected",
      after: { reviewedByUserId } as any,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
