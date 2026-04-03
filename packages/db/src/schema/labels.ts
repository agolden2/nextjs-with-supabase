import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

export const labels = pgTable("labels", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: varchar("color", { length: 7 }).notNull().default("#6b7280"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
