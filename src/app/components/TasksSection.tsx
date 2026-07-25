import { Task } from "@/types/tasks";
import { Theme } from "@/types/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import useTheme from "../hooks/useTheme";
import CustomChecklist from "./CustomChecklist";

type TasksSectionProps = {
  title: string;
  value: Task[];
  onChange: (tasks: Task[]) => void;
  allowAdd?: boolean;
};

const TasksSection = ({
  title,
  value,
  onChange,
  allowAdd = false,
}: TasksSectionProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const createEmptyTask = (): Task => ({
    date: new Date().toISOString().slice(0, 10),
    title: "",
    completed: false,
    createdAt: Date.now(),
  });
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.container}>
        {value.map((task, index) => (
          <View key={task.id ?? index} style={styles.row}>
            <CustomChecklist
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              checked={task.completed}
              value={task.title}
              placeholder={allowAdd ? "Add a new task..." : ""}
              returnKeyType={
                allowAdd && index === value.length - 1 ? "next" : "done"
              }
              onToggle={() => {
                const next = [...value];
                next[index] = {
                  ...task,
                  completed: !task.completed,
                };
                onChange(next);
              }}
              onSubmitEditing={() => {
                if (
                  allowAdd &&
                  index === value.length - 1 &&
                  task.title.trim() !== ""
                ) {
                  onChange([...value, createEmptyTask()]);

                  setTimeout(() => {
                    inputRefs.current[index + 1]?.focus();
                  }, 0);
                }
              }}
              onValueChange={(text) => {
                const next = [...value];
                next[index] = {
                  ...task,
                  title: text,
                };
                onChange(next);
              }}
            />

            {value.length > 1 && (
              <Pressable
                onPress={() => {
                  onChange(value.filter((_, i) => i !== index));
                }}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={20}
                  color={theme.textSecondary}
                />
              </Pressable>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      marginTop: 32,
    },

    title: {
      color: theme.text,
      fontWeight: "700",
      textAlign: "center",
      fontSize: 22,
      letterSpacing: -0.5,
      marginBottom: 16,
    },

    container: {
      padding: 24,
      paddingBottom: 25,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  });

export default TasksSection;
