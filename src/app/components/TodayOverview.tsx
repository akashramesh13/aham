import { JournalEntry } from "@/types/journal";
import { Theme } from "@/types/theme";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import useTheme from "../hooks/useTheme";
import GratitudeCard from "./GratitudeCard";
import HoursOfSleepCard from "./HoursOfSleepCard";
import MoodCard from "./MoodCard";
import SubmitButton from "./SubmitButton";

const TodayOverview = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [entry, setEntry] = useState<JournalEntry>({
    date: null,
    mood: null,
    gratitude: [""],
    hoursOfSleep: 0,
    goals: [],
    todos: [],
  });

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>Today&apos;s Journal</Text>
      </View>

      <MoodCard
        value={entry.mood}
        onChange={(mood) => setEntry((prev) => ({ ...prev, mood }))}
      />

      <View style={styles.topRow}>
        <GratitudeCard
          gratitude={entry.gratitude}
          onChange={(gratitude) =>
            setEntry((prev) => ({
              ...prev,
              gratitude: gratitude ?? [""],
            }))
          }
        />
        <HoursOfSleepCard
          value={entry.hoursOfSleep}
          onChange={(hoursOfSleep) =>
            setEntry((prev) => ({ ...prev, hoursOfSleep }))
          }
        />
      </View>

      {/* <GoalsSection /> */}
      {/* <TodoSection /> */}
      <SubmitButton entry={entry} />
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginTop: 25,
    },
    title: {
      alignSelf: "center",
      color: theme.text,
      fontFamily: "BodyFont-Bold",
      fontSize: 25,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginTop: 24,
      gap: 16,
    },
  });

export default TodayOverview;
