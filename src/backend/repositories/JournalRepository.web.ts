import { JournalEntry } from "@/types/journal";

const KEY = "journals";

export class JournalRepository {
  static async save(entry: JournalEntry) {
    const journals: Record<string, JournalEntry> = JSON.parse(
      localStorage.getItem(KEY) ?? "{}",
    );

    journals[entry.date!] = entry;

    localStorage.setItem(KEY, JSON.stringify(journals));
  }

  static async get(date: string): Promise<JournalEntry | null> {
    const journals: Record<string, JournalEntry> = JSON.parse(
      localStorage.getItem(KEY) ?? "{}",
    );

    return journals[date] ?? null;
  }

  static async getAllDates(): Promise<string[]> {
    const journals: Record<string, JournalEntry> = JSON.parse(
      localStorage.getItem(KEY) ?? "{}",
    );
    return Object.keys(journals);
  }
}
