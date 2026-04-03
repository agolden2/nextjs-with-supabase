import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { agents } from "@forge/db/schema";
import { createAgentSchema, updateAgentSchema } from "@forge/shared/validators";
import { getDb } from "@forge/db/client";

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
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/agents/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const db = getDb();
    await db.delete(agents).where(eq(agents.id, req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
