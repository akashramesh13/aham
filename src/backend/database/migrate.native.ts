import { Platform } from "react-native";

export async function migrateDatabase() {
  if (Platform.OS === "web") {
    return;
  }

  const { migrate } = await import("drizzle-orm/expo-sqlite/migrator");
  const { db } = await import("./client");
  const migrations = (await import("./migrations/migrations")).default;

  await migrate(db, migrations);
}
