import { Task } from "@/types/tasks";

const KEY = "tasks";

export class TaskRepository {
  static async saveAll(date: string, list: Task[]) {
    const tasks: Record<string, Task[]> = JSON.parse(
      localStorage.getItem(KEY) ?? "{}",
    );

    tasks[date] = list;

    localStorage.setItem(KEY, JSON.stringify(tasks));
  }

  static async get(date: string): Promise<Task[]> {
    const tasks: Record<string, Task[]> = JSON.parse(
      localStorage.getItem(KEY) ?? "{}",
    );

    return tasks[date] ?? [];
  }
}
