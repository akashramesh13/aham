import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const gratitude = sqliteTable("gratitude", {
  id: integer().primaryKey({ autoIncrement: true }),

  journalId: integer().notNull(),

  text: text().notNull(),

  position: integer().notNull(),
});
