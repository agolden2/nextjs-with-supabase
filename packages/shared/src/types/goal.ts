import type { GOAL_LEVELS, GOAL_STATUSES } from "../constants.js";

export type GoalLevel = (typeof GOAL_LEVELS)[number];
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export interface Goal {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  level: GoalLevel;
  status: GoalStatus;
  progress: number;
  parentId: string | null;
  ownerAgentId: string | null;
  projectId: string | null;
  targetDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGoalInput {
  companyId: string;
  title: string;
  description?: string;
  level?: GoalLevel;
  parentId?: string;
  ownerAgentId?: string;
  projectId?: string;
  targetDate?: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  level?: GoalLevel;
  status?: GoalStatus;
  progress?: number;
  parentId?: string | null;
  ownerAgentId?: string | null;
  projectId?: string | null;
  targetDate?: string | null;
}
