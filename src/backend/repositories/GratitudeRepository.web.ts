const KEY = "gratitude";

export class GratitudeRepository {
  static async saveAll(journalId: number, items: string[]) {
    const gratitude: Record<number, string[]> = JSON.parse(
      localStorage.getItem(KEY) ?? "{}",
    );

    gratitude[journalId] = items.filter((x) => x.trim());

    localStorage.setItem(KEY, JSON.stringify(gratitude));
  }

  static async get(journalId: number): Promise<string[]> {
    const gratitude: Record<number, string[]> = JSON.parse(
      localStorage.getItem(KEY) ?? "{}",
    );

    return gratitude[journalId] ?? [];
  }
}
