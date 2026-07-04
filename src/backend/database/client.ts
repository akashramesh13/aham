import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

import * as schema from "./schema";

const sqlite = openDatabaseSync("aham.db");

export const db = drizzle(sqlite, {
  schema,
});
