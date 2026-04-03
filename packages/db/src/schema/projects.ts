import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { agents } from "./agents";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).notNull().default("planning"),
  leadAgentId: uuid("lead_agent_id").references(() => agents.id, { onDelete: "set null" }),
  startDate: timestamp("start_date"),
  targetDate: timestamp("target_date"),
  color: varchar("color", { length: 7 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projectWorkspaces = pgTable("project_workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  cwd: text("cwd"),
  repoUrl: text("repo_url"),
  branch: varchar("branch", { length: 255 }),
  envVars: text("env_vars"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projectMembers = pgTable("project_members", {
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  agentId: uuid("agent_id").notNull().references(() => agents.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});
