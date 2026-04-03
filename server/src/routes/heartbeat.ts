import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { heartbeatRuns } from "@forge/db/schema";
import { getDb } from "@forge/db/client";

const router = Router();

// GET /api/heartbeat/runs?agentId=xxx
router.get("/runs", async (req, res, next) => {
  try {
    const db = getDb();
    const { agentId } = req.query as { agentId?: string };
    const result = agentId
      ? await db
          .select()
          .from(heartbeatRuns)
          .where(eq(heartbeatRuns.agentId, agentId))
          .orderBy(desc(heartbeatRuns.startedAt))
          .limit(50)
      : await db
          .select()
          .from(heartbeatRuns)
          .orderBy(desc(heartbeatRuns.startedAt))
          .limit(50);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/heartbeat/trigger — manually trigger a heartbeat for an agent
router.post("/trigger", async (req, res, next) => {
  try {
    const { agentId } = req.body as { agentId: string };
    if (!agentId) {
      res.status(400).json({ error: "agentId is required" });
      return;
    }
    // The actual heartbeat service would handle this; for now we just log
    res.json({ message: "Heartbeat triggered", agentId });
  } catch (err) {
    next(err);
  }
});

export default router;
