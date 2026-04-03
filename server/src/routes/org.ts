import { Router } from "express";
import { eq, and, notInArray, sql } from "drizzle-orm";
import { agents, issues } from "@forge/db/schema";
import { getDb } from "@forge/db/client";
import type { OrgNode, Agent } from "@forge/shared/types";

const router = Router();

// GET /api/org?companyId=xxx — returns OrgNode[] tree
router.get("/", async (req, res, next) => {
  try {
    const db = getDb();
    const { companyId } = req.query as { companyId?: string };
    if (!companyId) {
      res.status(400).json({ error: "companyId is required" });
      return;
    }

    const allAgents = await db
      .select()
      .from(agents)
      .where(eq(agents.companyId, companyId));

    const issueCounts = await db
      .select({
        assigneeId: issues.assigneeId,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(issues)
      .where(
        and(
          eq(issues.companyId, companyId),
          notInArray(issues.status, ["done", "cancelled"])
        )
      )
      .groupBy(issues.assigneeId);

    const countMap = new Map(
      issueCounts.map((row: { assigneeId: string | null; count: number }) => [row.assigneeId, row.count])
    );

    function buildTree(parentId: string | null): OrgNode[] {
      return allAgents
        .filter((a: { reportsTo: string | null; id: string }) => (a.reportsTo ?? null) === parentId)
        .map((a: { id: string; reportsTo: string | null }) => ({
          agent: a as unknown as Agent,
          children: buildTree(a.id),
          issueCount: countMap.get(a.id) ?? 0,
          activeRunCount: 0,
        }));
    }

    res.json(buildTree(null));
  } catch (err) {
    next(err);
  }
});

export default router;
