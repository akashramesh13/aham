import { JournalEntry } from "@/types/journal";
import { Task } from "@/types/tasks";
import { Theme } from "@/types/theme";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import useTheme from "../hooks/useTheme";
import GratitudeCard from "./GratitudeCard";
import HoursOfSleepCard from "./HoursOfSleepCard";
import MoodCard from "./MoodCard";
import SubmitButton from "./SubmitButton";
import TasksCard from "./TasksCard";

const TodayOverview = () => {
  const saveJournal = async (entry: JournalEntry) => {};
  const saveTodayTasks = async (tasks: Task[]) => {};
  const updateCarriedOverTasks = async (tasks: Task[]) => {};

  const [todayTasks, setTodayTasks] = useState<Task[]>([
    {
      title: "",
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [carriedOverTasks, setCarriedOverTasks] = useState<Task[]>([]);

  const handleSave = async () => {
    await saveJournal(entry);
    await saveTodayTasks(todayTasks);
    await updateCarriedOverTasks(carriedOverTasks);
  };

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [entry, setEntry] = useState<JournalEntry>({
    date: null,
    mood: null,
    gratitude: [""],
    hoursOfSleep: 0,
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      title: "",
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ]);

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

      <TasksCard
        todayTasks={todayTasks}
        onTodayTasksChange={setTodayTasks}
        carriedOverTasks={carriedOverTasks}
        onCarriedOverTasksChange={setCarriedOverTasks}
      />

      <SubmitButton onPress={handleSave} />
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
