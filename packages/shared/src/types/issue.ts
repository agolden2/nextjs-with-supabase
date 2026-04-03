import type { ISSUE_STATUSES, ISSUE_PRIORITIES } from "../constants.js";

export type IssueStatus = (typeof ISSUE_STATUSES)[number];
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];

export interface Issue {
  id: string;
  companyId: string;
  number: number;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  assigneeId: string | null;
  projectId: string | null;
  goalId: string | null;
  checkoutRunId: string | null;
  executionLockedAt: Date | null;
  costCents: number;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIssueInput {
  companyId: string;
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: string;
  projectId?: string;
  goalId?: string;
  dueDate?: string;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: string | null;
  projectId?: string | null;
  goalId?: string | null;
  dueDate?: string | null;
}

export interface BulkUpdateIssuesInput {
  issueIds: string[];
  updates: UpdateIssueInput;
}
