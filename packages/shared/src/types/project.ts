import type { PROJECT_STATUSES, PROJECT_MEMBER_ROLES } from "../constants.js";

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ProjectMemberRole = (typeof PROJECT_MEMBER_ROLES)[number];

export interface Project {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  leadAgentId: string | null;
  startDate: Date | null;
  targetDate: Date | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectWorkspace {
  id: string;
  projectId: string;
  name: string;
  cwd: string | null;
  repoUrl: string | null;
  branch: string | null;
  envVars: Record<string, string> | null;
  createdAt: Date;
}

export interface ProjectMember {
  projectId: string;
  agentId: string;
  role: ProjectMemberRole;
  joinedAt: Date;
}

export interface CreateProjectInput {
  companyId: string;
  name: string;
  description?: string;
  status?: ProjectStatus;
  leadAgentId?: string;
  startDate?: string;
  targetDate?: string;
  color?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  leadAgentId?: string | null;
  startDate?: string | null;
  targetDate?: string | null;
  color?: string;
}
