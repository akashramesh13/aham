import { Mood } from "./mood";

export type MoodButtonProps = {
  mood: Mood;
  selected: boolean;
  onPress: () => void;
};
