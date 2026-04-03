import { Router } from "express";
import { eq, and, sql, desc } from "drizzle-orm";
import { costEvents, agents } from "@forge/db/schema";
import { getDb } from "@forge/db/client";

const router = Router();

// GET /api/costs?companyId=xxx&agentId=xxx
router.get("/", async (req, res, next) => {
  try {
    const db = getDb();
    const { companyId, agentId } = req.query as Record<string, string | undefined>;

    const conditions = [];
    if (companyId) conditions.push(eq(costEvents.companyId, companyId));
    if (agentId) conditions.push(eq(costEvents.agentId, agentId));

    const result =
      conditions.length > 0
        ? await db
            .select()
            .from(costEvents)
            .where(and(...conditions))
            .orderBy(desc(costEvents.createdAt))
            .limit(500)
        : await db
            .select()
            .from(costEvents)
            .orderBy(desc(costEvents.createdAt))
            .limit(500);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/costs/summary?companyId=xxx — aggregated by agent
router.get("/summary", async (req, res, next) => {
  try {
    const db = getDb();
    const { companyId } = req.query as { companyId?: string };

    const summary = await db
      .select({
        agentId: costEvents.agentId,
        totalCents: sql<number>`cast(sum(cost_cents) as int)`,
        eventCount: sql<number>`cast(count(*) as int)`,
      })
      .from(costEvents)
      .where(companyId ? eq(costEvents.companyId, companyId) : sql`true`)
      .groupBy(costEvents.agentId);

    res.json(summary);
  } catch (err) {
    next(err);
  }
});

export default router;
