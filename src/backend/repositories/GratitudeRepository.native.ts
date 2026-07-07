import { asc, eq } from "drizzle-orm";

import { db } from "../database/client.native";
import { gratitude } from "../database/schema";

export class GratitudeRepository {
  static async saveAll(journalId: number, items: string[]) {
    await db.delete(gratitude).where(eq(gratitude.journalId, journalId));

    const values = items
      .filter((item) => item.trim() !== "")
      .map((text, position) => ({
        journalId,
        text,
        position,
      }));

    if (values.length) {
      await db.insert(gratitude).values(values);
    }
  }

  static async get(journalId: number): Promise<string[]> {
    const rows = await db.query.gratitude.findMany({
      where: eq(gratitude.journalId, journalId),
      orderBy: [asc(gratitude.position)],
    });

    return rows.map((row) => row.text);
  }
}
