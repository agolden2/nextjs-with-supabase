import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { agents } from "@forge/db/schema";
import { createAgentSchema, updateAgentSchema } from "@forge/shared/validators";
import { getDb } from "@forge/db/client";
import { broadcast } from "../realtime/ws-server.js";
import { makeEvent } from "../realtime/events.js";
import { logActivity } from "../services/activity.js";

const router = Router();

// GET /api/agents?companyId=xxx
router.get("/", async (req, res, next) => {
  try {
    const db = getDb();
    const { companyId } = req.query as { companyId?: string };
    const query = db.select().from(agents);
    const result = companyId
      ? await query.where(eq(agents.companyId, companyId))
      : await query;
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/agents/:id
router.get("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, req.params.id));
    if (!agent) {
      res.status(404).json({ error: "Agent not found" });
      return;
    }
    res.json(agent);
  } catch (err) {
    next(err);
  }
});

// POST /api/agents
router.post("/", async (req, res, next) => {
  try {
    const db = getDb();
    const input = createAgentSchema.parse(req.body);
    const [created] = await db.insert(agents).values(input).returning();

    broadcast(makeEvent("agent:updated", created.companyId, created));
    logActivity({
      companyId: created.companyId,
      entityType: "agent",
      entityId: created.id,
      action: "created",
      after: created as any,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/agents/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const input = updateAgentSchema.parse(req.body);
    const [updated] = await db
      .update(agents)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(agents.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Agent not found" });
      return;
    }

    broadcast(makeEvent("agent:updated", updated.companyId, updated));
    logActivity({
      companyId: updated.companyId,
      entityType: "agent",
      entityId: updated.id,
      action: "updated",
      after: updated as any,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/agents/:id/pause
router.post("/:id/pause", async (req, res, next) => {
  try {
    const db = getDb();
    const [updated] = await db
      .update(agents)
      .set({ status: "paused", updatedAt: new Date() })
      .where(and(eq(agents.id, req.params.id), eq(agents.status, "active")))
      .returning();
    if (!updated) {
      res.status(409).json({ error: "Agent not found or not active" });
      return;
    }

    broadcast(makeEvent("agent:updated", updated.companyId, updated));
    logActivity({
      companyId: updated.companyId,
      entityType: "agent",
      entityId: updated.id,
      action: "paused",
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/agents/:id/resume
router.post("/:id/resume", async (req, res, next) => {
  try {
    const db = getDb();
    const [updated] = await db
      .update(agents)
      .set({ status: "active", updatedAt: new Date() })
      .where(and(eq(agents.id, req.params.id), eq(agents.status, "paused")))
      .returning();
    if (!updated) {
      res.status(409).json({ error: "Agent not found or not paused" });
      return;
    }

    broadcast(makeEvent("agent:updated", updated.companyId, updated));
    logActivity({
      companyId: updated.companyId,
      entityType: "agent",
      entityId: updated.id,
      action: "resumed",
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/agents/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    const [deleted] = await db
      .delete(agents)
      .where(eq(agents.id, req.params.id))
      .returning();

    if (deleted) {
      broadcast(makeEvent("agent:updated", deleted.companyId, { id: deleted.id, deleted: true }));
      logActivity({
        companyId: deleted.companyId,
        entityType: "agent",
        entityId: deleted.id,
        action: "deleted",
      });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
