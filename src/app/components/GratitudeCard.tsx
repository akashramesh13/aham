import { GratitudeCardProps } from "@/types/gratitudeCard";
import { Theme } from "@/types/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import useTheme from "../hooks/useTheme";
import CustomTextInput from "./CustomTextInput";
import GlassCard from "./GlassCard";

export default function GratitudeCard({
  gratitude,
  onChange,
}: GratitudeCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const addGratitude = () => {
    // Don't create multiple empty rows.
    if (gratitude.at(-1)?.trim() === "") {
      inputRefs.current[gratitude.length - 1]?.focus();
      return;
    }

    onChange([...gratitude, ""]);

    requestAnimationFrame(() => {
      inputRefs.current[gratitude.length]?.focus();
    });
  };

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>Gratitude</Text>

      {gratitude.map((item, index) => (
        <View key={index} style={styles.row}>
          <CustomTextInput
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={styles.input}
            value={item}
            placeholder="What are you grateful for today?"
            onChangeText={(text) => {
              const next = [...gratitude];
              next[index] = text;
              onChange(next);
            }}
            returnKeyType={index === gratitude.length - 1 ? "done" : "next"}
            onSubmitEditing={() => {
              if (index < gratitude.length - 1) {
                inputRefs.current[index + 1]?.focus();
              } else {
                addGratitude();
              }
            }}
          />

          {gratitude.length > 1 && (
            <Pressable
              style={styles.deleteButton}
              onPress={() => {
                const next = gratitude.filter((_, i) => i !== index);

                // Always keep at least one empty field.
                onChange(next.length === 0 ? [""] : next);
              }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          )}
        </View>
      ))}

      <Pressable
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        onPress={addGratitude}
      >
        <Ionicons name="add-circle-outline" size={18} color={theme.accent} />

        <Text style={styles.addButtonText}>Add another</Text>
      </Pressable>
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

    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },

    input: {
      flex: 1,
    },

    deleteButton: {
      marginLeft: 12,
      padding: 4,
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
