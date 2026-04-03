import { pgTable, uuid, text, integer, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const agents = pgTable("agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  role: varchar("role", { length: 30 }).notNull().default("custom"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  adapterType: varchar("adapter_type", { length: 30 }).notNull().default("claude_local"),
  adapterConfig: jsonb("adapter_config"),
  reportsTo: uuid("reports_to"),
  systemPrompt: text("system_prompt"),
  heartbeatIntervalSeconds: integer("heartbeat_interval_seconds").notNull().default(300),
  budgetMonthlyCents: integer("budget_monthly_cents").notNull().default(10000),
  spentMonthlyCents: integer("spent_monthly_cents").notNull().default(0),
  lastHeartbeat: timestamp("last_heartbeat"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
