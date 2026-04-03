import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import { activityLog } from "@forge/db/schema";
import { getDb } from "@forge/db/client";

const router = Router();

// GET /api/activity?companyId=xxx&entityType=issue&entityId=xxx
router.get("/", async (req, res, next) => {
  try {
    const db = getDb();
    const { companyId, entityType, entityId } = req.query as Record<
      string,
      string | undefined
    >;

    const conditions = [];
    if (companyId) conditions.push(eq(activityLog.companyId, companyId));
    if (entityType) conditions.push(eq(activityLog.entityType, entityType));
    if (entityId) conditions.push(eq(activityLog.entityId, entityId));

    const result =
      conditions.length > 0
        ? await db
            .select()
            .from(activityLog)
            .where(and(...conditions))
            .orderBy(desc(activityLog.createdAt))
            .limit(200)
        : await db
            .select()
            .from(activityLog)
            .orderBy(desc(activityLog.createdAt))
            .limit(200);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
