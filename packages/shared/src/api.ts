export const API_PREFIX = "/api";

export const API_ROUTES = {
  health: `${API_PREFIX}/health`,
  companies: `${API_PREFIX}/companies`,
  agents: `${API_PREFIX}/agents`,
  issues: `${API_PREFIX}/issues`,
  projects: `${API_PREFIX}/projects`,
  goals: `${API_PREFIX}/goals`,
  approvals: `${API_PREFIX}/approvals`,
  costs: `${API_PREFIX}/costs`,
  activity: `${API_PREFIX}/activity`,
  org: `${API_PREFIX}/org`,
  labels: `${API_PREFIX}/labels`,
  comments: `${API_PREFIX}/comments`,
  heartbeat: `${API_PREFIX}/heartbeat`,
} as const;
