import { moods } from "@/constants/mood";
import { MoodLabel } from "./mood";

export type Mood = (typeof moods)[number];

export interface JournalEntry {
  id?: number;

  date: string;

  mood: MoodLabel | null;

  hoursOfSleep: number | null;

  gratitude: string[];
}
