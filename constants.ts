export const moods = [
  {
    label: "happy",
    display: "Happy",
    icon: "happy-outline",
  },
  {
    label: "neutral",
    display: "Neutral",
    icon: "remove-circle-outline",
  },
  {
    label: "sad",
    display: "Sad",
    icon: "sad-outline",
  },
] as const;

export type Mood = (typeof moods)[number];
