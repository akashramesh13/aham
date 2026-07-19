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
import { Ionicons } from "@expo/vector-icons";

import useTheme from "../hooks/useTheme";

import GratitudeCard from "./GratitudeCard";
import HoursOfSleepCard from "./HoursOfSleepCard";
import GlassCard from "./GlassCard";
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

import { useLocalSearchParams, router } from "expo-router";

export default function TodayOverview({ 
  isEditingPast, 
  setIsEditingPast 
}: { 
  isEditingPast?: boolean; 
  setIsEditingPast?: (v: boolean) => void; 
} = {}) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const today = getToday();
  const { date } = useLocalSearchParams<{ date?: string }>();

  const isSaving = useRef(false);

  const [selectedDate, setSelectedDate] = useState(date ?? today);

  useEffect(() => {
    if (date && date !== selectedDate) {
      setSelectedDate(date);
    }
  }, [date]);

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

  // Use local state if props are not provided
  const [localIsEditingPast, setLocalIsEditingPast] = useState(false);
  const actualIsEditingPast = isEditingPast ?? localIsEditingPast;
  const actualSetIsEditingPast = setIsEditingPast ?? setLocalIsEditingPast;

  const isReadOnly = selectedDate !== today && !actualIsEditingPast;

  const goToToday = async () => {
    if (selectedDate === today) return;

    await handleSave();

    setSelectedDate(today);
    actualSetIsEditingPast(false);
  };

  const changeDay = async (offset: number) => {
    await handleSave();

    const next = new Date(selectedDate);
    next.setDate(next.getDate() + offset);

    setSelectedDate(next.toISOString().slice(0, 10));
    actualSetIsEditingPast(false);
  };

  useEffect(() => {
    actualSetIsEditingPast(false);
  }, [selectedDate]);

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.left}>
          <Pressable
            onPress={() => changeDay(-1)}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [styles.center, pressed && styles.pressed]}
          onPress={() => router.push("/(tabs)/calendar")}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {isReadOnly && <Ionicons name="lock-closed" size={14} color={theme.textSecondary} />}
            <Text style={styles.title}>Journal</Text>
          </View>

          <Text style={styles.weekday}>
            {selectedDate === today ? "Today" : formatWeekday(selectedDate)}
          </Text>

          <Text style={styles.date}>{formatDate(selectedDate)}</Text>
        </Pressable>

        <View style={styles.right}>
          {selectedDate !== today ? (
            <Pressable
              onPress={goToToday}
              style={({ pressed }) => [styles.todayButton, pressed && styles.pressed]}
            >
              <Text style={styles.todayButtonText}>Today</Text>
            </Pressable>
          ) : (
            <View style={{ width: 44 }} />
          )}
        </View>
      </View>

      <View pointerEvents={isReadOnly ? "none" : "auto"} style={{ opacity: isReadOnly ? 0.7 : 1 }}>
        <Text style={styles.sectionTitle}>Daily Check-in</Text>
        <GlassCard style={styles.topRowCard}>
          <View style={styles.topRow}>
            <View style={styles.gridCol}>
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
            </View>

            <View style={styles.gridCol}>
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
          </View>
        </GlassCard>

      <Text style={styles.sectionTitle}>Reflection & Tasks</Text>
      <GlassCard style={styles.bottomRowCard}>
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

        <View style={styles.horizontalDivider} />

        <TasksCard
          todayTasks={tasks}
          onTodayTasksChange={(nextTasks) => {
            setDirty(true);
            setTasks(nextTasks);
          }}
          carriedOverTasks={carriedOverTasks}
          onCarriedOverTasksChange={setCarriedOverTasks}
        />
      </GlassCard>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      marginTop: 16,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
    },
    left: {
      width: 80,
      alignItems: "flex-start",
    },
    center: {
      flex: 1,
      alignItems: "center",
    },

    right: {
      width: 80,
      alignItems: "flex-end",
    },

    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.glassBackground,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.glassBorder,
    },

    pressed: {
      opacity: 0.7,
      transform: [{ scale: 0.95 }],
    },

    todayButton: {
      backgroundColor: theme.accent + "22",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },

    todayButtonText: {
      color: theme.accent,
      fontWeight: "700",
      fontSize: 14,
    },

    title: {
      color: theme.textSecondary,
      fontWeight: "700",
      fontSize: 14,
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },

    weekday: {
      marginTop: 4,
      color: theme.text,
      fontWeight: "800",
      fontSize: 34,
      letterSpacing: -1,
    },

    date: {
      marginTop: 2,
      color: theme.textSecondary,
      fontWeight: "500",
      fontSize: 16,
    },
    sectionTitle: {
      color: theme.text,
      fontWeight: "700",
      fontSize: 20,
      marginTop: 32,
      marginLeft: 4,
      letterSpacing: -0.5,
    },
    topRowCard: {
      marginTop: 24,
      marginBottom: 24,
    },
    bottomRowCard: {
      marginTop: 24,
      marginBottom: 48,
    },
    floatingEditButton: {
      position: "absolute",
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.accent,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "stretch",
    },
    horizontalDivider: {
      height: 1,
      backgroundColor: theme.glassBorder,
      marginHorizontal: 16,
      marginVertical: 16,
    },
    gridCol: {
      flex: 1,
    },
  });
