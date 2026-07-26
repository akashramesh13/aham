import { JournalService } from "@/backend/services/JournalService";
import { JournalEntry } from "@/types/journal";
import { Task } from "@/types/tasks";
import { Theme } from "@/types/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

import useTheme from "../hooks/useTheme";

import GratitudeCard from "./GratitudeCard";
import HoursOfSleepCard from "./HoursOfSleepCard";
import MoodCard from "./MoodCard";
import TasksCard from "./TasksCard";

/** Return YYYY-MM-DD in the device's local timezone (not UTC). */
const getLocalDateString = (d: Date = new Date()): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getToday = () => getLocalDateString();

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

/** Parse YYYY-MM-DD as local (not UTC) by splitting manually. */
const parseLocalDate = (date: string): Date => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const formatWeekday = (date: string) =>
  parseLocalDate(date).toLocaleDateString(undefined, {
    weekday: "long",
  });

const formatDate = (date: string) =>
  parseLocalDate(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });

import { router, useLocalSearchParams } from "expo-router";

export default function TodayOverview({
  isEditingPast,
  setIsEditingPast,
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

  // Fade transition when switching days
  const contentOpacity = useSharedValue(1);
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

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
    contentOpacity.value = withTiming(0.3, { duration: 100 });
    setLoadingDay(true);

    const data = await JournalService.load(date);

    setEntry(data.entry);
    setTasks(data.tasks);
    setCarriedOverTasks([]);

    setDirty(false);
    setLoadingDay(false);
    contentOpacity.value = withTiming(1, { duration: 200 });
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

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await handleSave();

    setSelectedDate(today);
    actualSetIsEditingPast(false);
  };

  const changeDay = async (offset: number) => {
    // Prevent navigating to future dates
    if (offset > 0 && selectedDate >= today) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await handleSave();

    const next = parseLocalDate(selectedDate);
    next.setDate(next.getDate() + offset);
    const nextDate = getLocalDateString(next);

    // Don't go past today
    if (nextDate > today) return;

    setSelectedDate(nextDate);
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
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [styles.center, pressed && styles.pressed]}
          onPress={() => router.push({ pathname: "/", params: { tab: "calendar", selectedDate: selectedDate } })}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {isReadOnly && (
              <Ionicons
                name="lock-closed"
                size={14}
                color={theme.textSecondary}
              />
            )}
            <Text style={styles.title}>Journal</Text>
          </View>

          <Text style={styles.weekday}>
            {selectedDate === today ? "Today" : formatWeekday(selectedDate)}
          </Text>

          <Text style={styles.date}>{formatDate(selectedDate)}</Text>
        </Pressable>

        <View style={styles.right}>
          {selectedDate === today ? (
            <Pressable
              onPress={() => changeDay(1)}
              style={({ pressed }) => [
                styles.iconButton,
                styles.iconButtonDisabled,
                pressed && styles.pressed,
              ]}
              disabled
            >
              <Ionicons name="chevron-forward" size={24} color={theme.textSecondary + "44"} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => changeDay(1)}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="chevron-forward" size={24} color={theme.text} />
            </Pressable>
          )}
        </View>
      </View>

      {selectedDate !== today && (
        <Pressable
          onPress={goToToday}
          style={({ pressed }) => [
            styles.todayPill,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="today-outline" size={14} color={theme.accent} />
          <Text style={styles.todayPillText}>Back to Today</Text>
        </Pressable>
      )}
      <Animated.View
        pointerEvents={isReadOnly ? "none" : "auto"}
        style={[{ opacity: isReadOnly ? 0.7 : 1 }, contentAnimatedStyle]}
      >
        <Text style={styles.sectionTitle}>Daily Check-in</Text>

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

        <Text style={styles.sectionTitle}>Reflection</Text>

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

        <Text style={styles.sectionTitle}>Tasks</Text>

        <TasksCard
          todayTasks={tasks}
          onTodayTasksChange={(nextTasks) => {
            setDirty(true);
            setTasks(nextTasks);
          }}
          carriedOverTasks={carriedOverTasks}
          onCarriedOverTasksChange={setCarriedOverTasks}
        />
      </Animated.View>
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
      backgroundColor: theme.surface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },

    iconButtonDisabled: {
      opacity: 0.4,
      borderColor: theme.border + "44",
    },

    pressed: {
      opacity: 0.7,
      transform: [{ scale: 0.95 }],
    },

    todayPill: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      gap: 6,
      backgroundColor: theme.accent + "15",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginTop: 4,
      marginBottom: 8,
    },

    todayPillText: {
      color: theme.accent,
      fontWeight: "700",
      fontSize: 13,
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
      fontSize: 22,
      marginTop: 32,
      marginBottom: 16,
      marginLeft: 4,
      letterSpacing: -0.5,
    },
    topRow: {
      flexDirection: "column",
      gap: 16,
      marginTop: 16,
      marginBottom: 8,
    },

    gridCol: {
      flex: 1,
    },
  });
