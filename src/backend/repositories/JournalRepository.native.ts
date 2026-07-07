import { eq } from "drizzle-orm";

import { db } from "../database/client";
import { journals } from "../database/schema";
import { GratitudeRepository } from "./GratitudeRepository";

import { JournalEntry } from "@/types/journal";

export class JournalRepository {
  static async save(entry: JournalEntry) {
    const now = Date.now();

    await db
      .insert(journals)
      .values({
        date: entry.date!,
        mood: entry.mood,
        hoursOfSleep: entry.hoursOfSleep,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: journals.date,
        set: {
          mood: entry.mood,
          hoursOfSleep: entry.hoursOfSleep,
          updatedAt: now,
        },
      });

    const journal = await db.query.journals.findFirst({
      where: eq(journals.date, entry.date!),
    });

    if (!journal) {
      throw new Error("Journal not found after save.");
    }

    await GratitudeRepository.saveAll(journal.id, entry.gratitude);
  }

  static async get(date: string): Promise<JournalEntry | null> {
    const row = await db.query.journals.findFirst({
      where: eq(journals.date, date),
    });

    if (!row) return null;

    const gratitude = await GratitudeRepository.get(row.id);

    return {
      date: row.date,
      mood: row.mood as JournalEntry["mood"],
      gratitude: gratitude.length ? gratitude : [""],
      hoursOfSleep: row.hoursOfSleep,
    };
  }
}
