import { JournalService } from "@/backend/services/JournalService";
import { JournalEntry } from "@/types/journal";
import { Task } from "@/types/tasks";
import { Theme } from "@/types/theme";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  AppStateStatus,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import useTheme from "../hooks/useTheme";

import GratitudeCard from "./GratitudeCard";
import HoursOfSleepCard from "./HoursOfSleepCard";
import MoodCard from "./MoodCard";
import TasksCard from "./TasksCard";

const getToday = () => new Date().toISOString().slice(0, 10);

const emptyEntry = (date: string): JournalEntry => ({
  date,
  mood: null,
  gratitude: [""],
  hoursOfSleep: 0,
});

const emptyTasks = (date: string): Task[] => [
  {
    date,
    title: "",
    completed: false,
    createdAt: Date.now(),
  },
];

const formatWeekday = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
  });

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });

export default function TodayOverview() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const today = getToday();

  const isSaving = useRef(false);

  const [selectedDate, setSelectedDate] = useState(today);

  const [dirty, setDirty] = useState(false);

  const [loadingDay, setLoadingDay] = useState(false);

  const [entry, setEntry] = useState<JournalEntry>(emptyEntry(today));

  const [tasks, setTasks] = useState<Task[]>(emptyTasks(today));

  const [carriedOverTasks, setCarriedOverTasks] = useState<Task[]>([]);

  const handleSave = async () => {
    if (!dirty || isSaving.current) return;

    isSaving.current = true;

    try {
      await JournalService.save(
        {
          ...entry,
          date: selectedDate,
        },
        tasks.map((task) => ({
          ...task,
          date: selectedDate,
        })),
      );

      setDirty(false);
    } catch (e) {
      console.error(e);

      Alert.alert(
        "Couldn't save",
        "Something went wrong while saving your journal.",
      );
    } finally {
      isSaving.current = false;
    }
  };

  const loadDay = async (date: string) => {
    setLoadingDay(true);

    const data = await JournalService.load(date);

    setEntry(data.entry);
    setTasks(data.tasks);
    setCarriedOverTasks([]);

    setDirty(false);
    setLoadingDay(false);
  };

  useEffect(() => {
    loadDay(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (!dirty || loadingDay) return;

    const timer = setTimeout(handleSave, 400);

    return () => clearTimeout(timer);
  }, [dirty, loadingDay, entry, tasks]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (state: AppStateStatus) => {
        if (state !== "active") {
          await handleSave();
        }
      },
    );

    return () => subscription.remove();
  }, [dirty, entry, tasks, selectedDate]);

  const changeDay = async (offset: number) => {
    await handleSave();

    const next = new Date(selectedDate);

    next.setDate(next.getDate() + offset);

    setSelectedDate(next.toISOString().slice(0, 10));
  };

  const goToToday = async () => {
    if (selectedDate === today) return;

    await handleSave();

    setSelectedDate(today);
  };

  return (
    <View>
      <View style={styles.header}>
        <Pressable onPress={() => changeDay(-1)}>
          <Text style={styles.arrow}>←</Text>
        </Pressable>

        <View style={styles.center}>
          <Text style={styles.title}>Journal</Text>

          <Text style={styles.weekday}>
            {selectedDate === today ? "Today" : formatWeekday(selectedDate)}
          </Text>

          <Text style={styles.date}>{formatDate(selectedDate)}</Text>
        </View>

        <View style={styles.right}>
          {selectedDate !== today && (
            <Pressable onPress={goToToday}>
              <Text style={styles.todayButton}>Today</Text>
            </Pressable>
          )}
        </View>
      </View>

      <MoodCard
        value={entry.mood}
        onChange={(mood) => {
          setDirty(true);

          setEntry((prev) => ({
            ...prev,
            mood,
          }));
        }}
      />

      <View style={styles.topRow}>
        <GratitudeCard
          gratitude={entry.gratitude}
          onChange={(gratitude) => {
            setDirty(true);

            setEntry((prev) => ({
              ...prev,
              gratitude: gratitude ?? [""],
            }));
          }}
        />

        <HoursOfSleepCard
          value={entry.hoursOfSleep}
          onChange={(hoursOfSleep) => {
            setDirty(true);

            setEntry((prev) => ({
              ...prev,
              hoursOfSleep,
            }));
          }}
        />
      </View>

      <TasksCard
        todayTasks={tasks}
        onTodayTasksChange={(nextTasks) => {
          setDirty(true);
          setTasks(nextTasks);
        }}
        carriedOverTasks={carriedOverTasks}
        onCarriedOverTasksChange={setCarriedOverTasks}
      />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      marginTop: 25,
      flexDirection: "row",
      alignItems: "center",
    },

    center: {
      flex: 1,
      alignItems: "center",
    },

    right: {
      width: 60,
      alignItems: "flex-end",
    },

    arrow: {
      color: theme.text,
      fontSize: 28,
      width: 40,
      textAlign: "center",
    },

    todayButton: {
      color: theme.textSecondary,
      fontFamily: "BodyFont-Bold",
      fontSize: 16,
    },

    title: {
      color: theme.text,
      fontFamily: "BodyFont-Bold",
      fontSize: 25,
    },

    weekday: {
      marginTop: 6,
      color: theme.text,
      fontFamily: "BodyFont-Bold",
      fontSize: 18,
    },

    date: {
      marginTop: 2,
      color: theme.textSecondary,
      fontFamily: "BodyFont-Regular",
      fontSize: 16,
    },

    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginTop: 24,
      gap: 16,
    },
  });
