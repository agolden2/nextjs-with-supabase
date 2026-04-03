import { pgTable, uuid, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { agents } from "./agents.js";
import { projects } from "./projects.js";

export const goals = pgTable("goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  level: varchar("level", { length: 20 }).notNull().default("team"),
  status: varchar("status", { length: 20 }).notNull().default("not_started"),
  progress: integer("progress").notNull().default(0),
  parentId: uuid("parent_id"),
  ownerAgentId: uuid("owner_agent_id").references(() => agents.id, { onDelete: "set null" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  targetDate: timestamp("target_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
