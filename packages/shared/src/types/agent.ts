import type { AGENT_STATUSES, AGENT_ROLES, AGENT_ADAPTER_TYPES } from "../constants.js";

export type AgentStatus = (typeof AGENT_STATUSES)[number];
export type AgentRole = (typeof AGENT_ROLES)[number];
export type AgentAdapterType = (typeof AGENT_ADAPTER_TYPES)[number];

export interface Agent {
  id: string;
  companyId: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  adapterType: AgentAdapterType;
  adapterConfig: Record<string, unknown> | null;
  reportsTo: string | null;
  systemPrompt: string | null;
  heartbeatIntervalSeconds: number;
  budgetMonthlyCents: number;
  spentMonthlyCents: number;
  lastHeartbeat: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrgNode {
  agent: Agent;
  children: OrgNode[];
  issueCount: number;
  activeRunCount: number;
}

export interface CreateAgentInput {
  companyId: string;
  name: string;
  role: AgentRole;
  adapterType: AgentAdapterType;
  adapterConfig?: Record<string, unknown>;
  reportsTo?: string;
  systemPrompt?: string;
  heartbeatIntervalSeconds?: number;
  budgetMonthlyCents?: number;
}

export interface UpdateAgentInput {
  name?: string;
  role?: AgentRole;
  status?: AgentStatus;
  adapterType?: AgentAdapterType;
  adapterConfig?: Record<string, unknown>;
  reportsTo?: string | null;
  systemPrompt?: string;
  heartbeatIntervalSeconds?: number;
  budgetMonthlyCents?: number;
}
