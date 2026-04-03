import { z } from "zod";
import {
  AGENT_ROLES,
  AGENT_ADAPTER_TYPES,
  AGENT_STATUSES,
} from "../constants.js";

export const createAgentSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(1).max(100),
  role: z.enum(AGENT_ROLES),
  adapterType: z.enum(AGENT_ADAPTER_TYPES),
  adapterConfig: z.record(z.unknown()).optional(),
  reportsTo: z.string().uuid().optional(),
  systemPrompt: z.string().optional(),
  heartbeatIntervalSeconds: z.number().int().min(30).default(300),
  budgetMonthlyCents: z.number().int().min(0).default(10000),
});

export const updateAgentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  role: z.enum(AGENT_ROLES).optional(),
  status: z.enum(AGENT_STATUSES).optional(),
  adapterType: z.enum(AGENT_ADAPTER_TYPES).optional(),
  adapterConfig: z.record(z.unknown()).optional(),
  reportsTo: z.string().uuid().nullable().optional(),
  systemPrompt: z.string().optional(),
  heartbeatIntervalSeconds: z.number().int().min(30).optional(),
  budgetMonthlyCents: z.number().int().min(0).optional(),
});

