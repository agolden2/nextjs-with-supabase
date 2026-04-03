export const COMPANY_STATUSES = ["active", "paused", "archived"] as const;

export const AGENT_STATUSES = ["active", "paused", "error", "provisioning"] as const;

export const AGENT_ROLES = [
  "ceo", "cto", "engineer", "designer", "pm",
  "marketing", "qa", "devops", "researcher", "custom"
] as const;

export const AGENT_ADAPTER_TYPES = [
  "claude_local", "codex_local", "openclaw_gateway",
  "cursor_local", "gemini_local", "process", "http"
] as const;

export const ISSUE_STATUSES = [
  "backlog", "todo", "in_progress", "in_review", "done", "cancelled"
] as const;

export const ISSUE_PRIORITIES = ["urgent", "high", "medium", "low", "none"] as const;

export const APPROVAL_TYPES = [
  "hire_agent", "approve_ceo_strategy", "budget_change", "custom"
] as const;

export const APPROVAL_STATUSES = ["pending", "approved", "rejected"] as const;

export const GOAL_LEVELS = ["company", "team", "task"] as const;

export const GOAL_STATUSES = ["not_started", "in_progress", "at_risk", "completed", "cancelled"] as const;

export const HEARTBEAT_INVOCATION_SOURCES = [
  "timer", "assignment", "on_demand", "automation"
] as const;

export const RUN_STATUSES = [
  "queued", "running", "completed", "failed", "cancelled", "timed_out"
] as const;

export const PROJECT_STATUSES = [
  "planning", "active", "on_hold", "completed", "cancelled"
] as const;

export const PROJECT_MEMBER_ROLES = ["lead", "member"] as const;

export const ACTIVITY_ENTITY_TYPES = [
  "company", "agent", "issue", "project", "goal", "approval", "heartbeat_run"
] as const;

export const DEFAULT_HEARTBEAT_INTERVAL_SECONDS = 300; // 5 minutes
export const DEFAULT_BUDGET_MONTHLY_CENTS = 10_000; // $100/month
export const MAX_CHECKOUT_LOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes
