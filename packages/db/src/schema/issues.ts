import { pgTable, uuid, text, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { agents } from "./agents";
import { projects } from "./projects";
import { goals } from "./goals";

export const issues = pgTable("issues", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).notNull().default("backlog"),
  priority: varchar("priority", { length: 10 }).notNull().default("none"),
  assigneeId: uuid("assignee_id").references(() => agents.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  goalId: uuid("goal_id").references(() => goals.id, { onDelete: "set null" }),
  // Atomic checkout lock — prevents concurrent agent execution on same issue
  checkoutRunId: uuid("checkout_run_id"),
  executionLockedAt: timestamp("execution_locked_at"),
  costCents: integer("cost_cents").notNull().default(0),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
