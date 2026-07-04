import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const settings = sqliteTable("settings", {
  key: text().primaryKey(),

  value: text().notNull(),
});
