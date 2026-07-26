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

  const createEmptyTask = (): Task => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return {
      date: `${yyyy}-${mm}-${dd}`,
      title: "",
      completed: false,
      createdAt: Date.now(),
    };
  };
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

        {allowAdd && (
          <Pressable
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
            onPress={() => {
              // Don't create multiple empty rows
              if (value.length > 0 && value[value.length - 1].title.trim() === "") {
                inputRefs.current[value.length - 1]?.focus();
                return;
              }
              onChange([...value, createEmptyTask()]);
              setTimeout(() => {
                inputRefs.current[value.length]?.focus();
              }, 50);
            }}
          >
            <Ionicons name="add-circle-outline" size={18} color={theme.accent} />
            <Text style={styles.addButtonText}>Add another</Text>
          </Pressable>
        )}
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
      marginBottom: 12,
    },

    addButton: {
      marginTop: 8,
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 18,
      backgroundColor: theme.accent + "12",
    },

    addButtonText: {
      marginLeft: 6,
      color: theme.accent,
      fontSize: 15,
      fontWeight: "600",
    },

    pressed: {
      opacity: 0.7,
      transform: [{ scale: 0.97 }],
    },
  });

export default TasksSection;
