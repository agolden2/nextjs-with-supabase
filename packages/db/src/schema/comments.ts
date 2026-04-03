import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { issues } from "./issues";
import { agents } from "./agents";

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  issueId: uuid("issue_id").notNull().references(() => issues.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  authorAgentId: uuid("author_agent_id").references(() => agents.id, { onDelete: "set null" }),
  authorUserId: text("author_user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
