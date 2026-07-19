import { TasksCardProps } from "@/types/tasksCardProps";
import { StyleSheet, Text } from "react-native";

import { Theme } from "@/types/theme";
import useTheme from "../hooks/useTheme";
import GlassCard from "./GlassCard";
import TasksSection from "./TasksSection";

export default function TasksCard({
  todayTasks,
  onTodayTasksChange,
  carriedOverTasks,
  onCarriedOverTasksChange,
}: TasksCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>Tasks</Text>

      <TasksSection
        title="Today's Tasks"
        value={todayTasks}
        onChange={onTodayTasksChange}
        allowAdd
      />

      {carriedOverTasks.length > 0 && (
        <TasksSection
          title="Carried Over"
          value={carriedOverTasks}
          onChange={onCarriedOverTasksChange}
        />
      )}
    </GlassCard>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      marginBottom: 20,
    },

    title: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 1,
      textAlign: "center",
      marginBottom: 20,
    },
  });
