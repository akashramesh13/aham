import { moods } from "@/constants/mood";

export type Mood = (typeof moods)[number];

export type MoodLabel = (typeof moods)[number]["label"];

export type MoodCardProps = {
  value: MoodLabel | null;
  onChange: (mood: MoodLabel) => void;
};