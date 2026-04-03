import { getDb } from "@forge/db/client";
import { activityLog } from "@forge/db/schema";

interface LogActivityInput {
  companyId: string;
  entityType: string;
  entityId: string;
  action: string;
  actorAgentId?: string;
  actorUserId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}

/** Fire-and-forget activity log writer — errors are swallowed so they never break mutations */
export function logActivity(input: LogActivityInput): void {
  const db = getDb();
  db.insert(activityLog)
    .values(input as any)
    .catch((err: Error) => console.error("[Activity]", err.message));
}
