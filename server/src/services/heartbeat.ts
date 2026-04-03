import { eq, and, inArray, isNull, sql } from "drizzle-orm";
import { agents, issues, heartbeatRuns, costEvents } from "@forge/db/schema";
import { getDb } from "@forge/db/client";
import { getAdapter } from "../adapters/index.js";

export async function runHeartbeat(agentId: string, source: string): Promise<void> {
  const db = getDb();

  const [agent] = await db.select().from(agents).where(eq(agents.id, agentId));
  if (!agent || agent.status !== "active") return;

  // Hard budget stop
  if (agent.spentMonthlyCents >= agent.budgetMonthlyCents) {
    await db
      .update(agents)
      .set({ status: "paused", updatedAt: new Date() })
      .where(eq(agents.id, agentId));
    console.log(`[Heartbeat] Agent ${agent.name} paused — budget exhausted`);
    return;
  }

  // Create run record
  const [run] = await db
    .insert(heartbeatRuns)
    .values({
      agentId,
      companyId: agent.companyId,
      source: source as any,
      status: "running",
    })
    .returning();

  // Find assigned issues that are not already checked out
  const assignedIssues = await db
    .select()
    .from(issues)
    .where(
      and(
        eq(issues.assigneeId, agentId),
        inArray(issues.status, ["todo", "in_progress"]),
        isNull(issues.checkoutRunId)
      )
    );

  const adapter = getAdapter(agent.adapterType);

  try {
    const result = await adapter.invoke(agent as any, {
      runId: run.id,
      issues: assignedIssues.map((i: { id: string; number: number; title: string; description: string | null; status: string; priority: string }) => ({
        id: i.id,
        number: i.number,
        title: i.title,
        description: i.description,
        status: i.status,
        priority: i.priority,
      })),
    });

    // Update agent spend + last heartbeat
    await db
      .update(agents)
      .set({
        spentMonthlyCents: sql`spent_monthly_cents + ${result.costCents}`,
        lastHeartbeat: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(agents.id, agentId));

    // Log cost event
    if (result.costCents > 0) {
      await db.insert(costEvents).values({
        agentId,
        companyId: agent.companyId,
        runId: run.id,
        costCents: result.costCents,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        model: result.model,
        description: `Heartbeat run ${run.id}`,
      });
    }

    await db
      .update(heartbeatRuns)
      .set({
        status: "completed",
        completedAt: new Date(),
        costCents: result.costCents,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        model: result.model,
        output: result.output,
      })
      .where(eq(heartbeatRuns.id, run.id));

    console.log(`[Heartbeat] Agent ${agent.name} completed — cost $${(result.costCents / 100).toFixed(4)}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await db
      .update(heartbeatRuns)
      .set({ status: "failed", error: message, completedAt: new Date() })
      .where(eq(heartbeatRuns.id, run.id));
    console.error(`[Heartbeat] Agent ${agent.name} failed:`, message);
  }
}

// Check every 10 seconds — invoke agents whose interval has elapsed
export function startHeartbeatScheduler(): NodeJS.Timeout {
  return setInterval(async () => {
    try {
      const db = getDb();
      const activeAgents = await db
        .select()
        .from(agents)
        .where(eq(agents.status, "active"));

      const now = Date.now();
      for (const agent of activeAgents) {
        const lastBeat = agent.lastHeartbeat?.getTime() ?? 0;
        if (now - lastBeat >= agent.heartbeatIntervalSeconds * 1000) {
          // Fire and forget; errors are captured per run
          runHeartbeat(agent.id, "timer").catch(() => {});
        }
      }
    } catch (err) {
      console.error("[Scheduler] Error:", err);
    }
  }, 10_000);
}
