import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { MoodLabel } from "@/types/mood";

export const journals = sqliteTable("journals", {
  id: integer().primaryKey({ autoIncrement: true }),

  date: text().notNull().unique(),

  mood: text({ mode: "text" }).$type<MoodLabel>(),

  hoursOfSleep: real(),

  createdAt: integer().notNull(),

  updatedAt: integer().notNull(),
});
