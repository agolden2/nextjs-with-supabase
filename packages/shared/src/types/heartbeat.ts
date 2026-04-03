import type { RUN_STATUSES, HEARTBEAT_INVOCATION_SOURCES } from "../constants.js";

export type RunStatus = (typeof RUN_STATUSES)[number];
export type HeartbeatInvocationSource = (typeof HEARTBEAT_INVOCATION_SOURCES)[number];

export interface HeartbeatRun {
  id: string;
  agentId: string;
  companyId: string;
  source: HeartbeatInvocationSource;
  status: RunStatus;
  error: string | null;
  costCents: number;
  inputTokens: number | null;
  outputTokens: number | null;
  model: string | null;
  output: string | null;
  startedAt: Date;
  completedAt: Date | null;
}

export interface CostEvent {
  id: string;
  agentId: string;
  companyId: string;
  runId: string | null;
  issueId: string | null;
  costCents: number;
  inputTokens: number | null;
  outputTokens: number | null;
  model: string | null;
  description: string | null;
  createdAt: Date;
}

export interface ActivityLog {
  id: string;
  companyId: string;
  entityType: string;
  entityId: string;
  action: string;
  actorAgentId: string | null;
  actorUserId: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  createdAt: Date;
}
