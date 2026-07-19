import { asc, eq } from "drizzle-orm";

import { db } from "../database/client";
import { tasks } from "../database/schema";

import { Task } from "@/types/tasks";

export class TaskRepository {
  static async saveAll(date: string, list: Task[]) {
    await db.delete(tasks).where(eq(tasks.date, date));

    const values = list
      .filter((task) => task.title.trim() !== "")
      .map((task, index) => ({
        date,
        text: task.title,
        completed: task.completed,
        carriedOver: false,
        position: index,
        createdAt: task.createdAt,
        completedAt: task.completed ? Date.now() : null,
      }));

    if (values.length) {
      await db.insert(tasks).values(values);
    }
  }

  static async get(date: string): Promise<Task[]> {
    const rows = await db.query.tasks.findMany({
      where: eq(tasks.date, date),
      orderBy: [asc(tasks.position)],
    });

    return rows.map((row: any) => ({
      id: row.id,
      date: row.date,
      title: row.text,
      completed: row.completed,
      createdAt: row.createdAt,
    }));
  }
}
