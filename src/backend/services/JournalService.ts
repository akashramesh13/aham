import { JournalRepository } from "../repositories/JournalRepository";
import { TaskRepository } from "../repositories/TaskRepository";

import { JournalEntry } from "@/types/journal";
import { Task } from "@/types/tasks";

export interface DailyJournal {
  entry: JournalEntry;
  tasks: Task[];
}

export class JournalService {
  static async save(entry: JournalEntry, tasks: Task[]) {
    await JournalRepository.save(entry);

    await TaskRepository.saveAll(entry.date!, tasks);
  }

  static async load(date: string): Promise<DailyJournal> {
    const entry = (await JournalRepository.get(date)) ?? {
      date,
      mood: null,
      gratitude: [""],
      hoursOfSleep: 0,
    };

    const tasks = await TaskRepository.get(date);

    return {
      entry,
      tasks:
        tasks.length > 0
          ? tasks
          : [
              {
                date,
                title: "",
                completed: false,
                createdAt: Date.now(),
              },
            ],
    };
  }
}
