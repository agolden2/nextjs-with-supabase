import type { APPROVAL_TYPES, APPROVAL_STATUSES } from "../constants.js";

export type ApprovalType = (typeof APPROVAL_TYPES)[number];
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export interface Approval {
  id: string;
  companyId: string;
  type: ApprovalType;
  status: ApprovalStatus;
  requestedByAgentId: string | null;
  reviewedByUserId: string | null;
  title: string;
  description: string | null;
  payload: Record<string, unknown> | null;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApprovalInput {
  companyId: string;
  type: ApprovalType;
  title: string;
  description?: string;
  requestedByAgentId?: string;
  payload?: Record<string, unknown>;
}

export interface ResolveApprovalInput {
  status: "approved" | "rejected";
  reviewedByUserId?: string;
}
