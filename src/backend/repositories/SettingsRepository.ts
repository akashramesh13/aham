import { eq } from "drizzle-orm";

import { db } from "../database/client";
import { settings } from "../database/schema";

export class SettingsRepository {
  static async get(key: string): Promise<string | null> {
    const row = await db.query.settings.findFirst({
      where: eq(settings.key, key),
    });

    return row?.value ?? null;
  }

  static async set(key: string, value: string) {
    await db
      .insert(settings)
      .values({
        key,
        value,
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          value,
        },
      });
  }
}
