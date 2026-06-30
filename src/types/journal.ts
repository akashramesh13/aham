import { moods } from "@/constants/mood";
import { MoodLabel } from "./mood";

export type Mood = (typeof moods)[number];

export interface JournalEntry {
  date: string | null;
  mood: MoodLabel | null;
  gratitude: string[];
  hoursOfSleep: number | null;
  goals: string[];
  todos: string[];
}
