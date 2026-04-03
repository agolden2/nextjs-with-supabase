import { z } from "zod";
import { ISSUE_STATUSES, ISSUE_PRIORITIES } from "../constants.js";

export const createIssueSchema = z.object({
  companyId: z.string().uuid(),
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  status: z.enum(ISSUE_STATUSES).default("backlog"),
  priority: z.enum(ISSUE_PRIORITIES).default("none"),
  assigneeId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  goalId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
});

export const updateIssueSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().nullable().optional(),
  status: z.enum(ISSUE_STATUSES).optional(),
  priority: z.enum(ISSUE_PRIORITIES).optional(),
  assigneeId: z.string().uuid().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
  goalId: z.string().uuid().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

export const bulkUpdateIssuesSchema = z.object({
  issueIds: z.array(z.string().uuid()).min(1),
  updates: updateIssueSchema,
});

