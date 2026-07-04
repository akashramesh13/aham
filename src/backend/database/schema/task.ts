import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: integer().primaryKey({ autoIncrement: true }),

  date: text().notNull(),

  text: text().notNull(),

  completed: integer({ mode: "boolean" }).notNull().default(false),

  carriedOver: integer({ mode: "boolean" }).notNull().default(false),

  position: integer().notNull(),

  createdAt: integer().notNull(),

  completedAt: integer(),
});
