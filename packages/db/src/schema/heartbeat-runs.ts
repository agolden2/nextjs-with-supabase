import { pgTable, uuid, text, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { agents } from "./agents";

export const heartbeatRuns = pgTable("heartbeat_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: uuid("agent_id").notNull().references(() => agents.id, { onDelete: "cascade" }),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  source: varchar("source", { length: 20 }).notNull().default("timer"),
  status: varchar("status", { length: 20 }).notNull().default("queued"),
  error: text("error"),
  costCents: integer("cost_cents").notNull().default(0),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  model: varchar("model", { length: 100 }),
  output: text("output"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});
