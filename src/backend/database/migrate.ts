import { migrate } from "drizzle-orm/expo-sqlite/migrator";

import { db } from "./client";

import migrations from "./migrations/migrations";

export async function migrateDatabase() {
  await migrate(db, migrations);
}
