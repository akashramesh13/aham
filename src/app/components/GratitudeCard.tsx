import { GratitudeCardProps } from "@/types/gratitudeCard";
import { Theme } from "@/types/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import useTheme from "../hooks/useTheme";
import CustomTextInput from "./CustomTextInput";
import GlassCard from "./GlassCard";

const GratitudeCard = ({ gratitude, onChange }: GratitudeCardProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  return (
    <View style={styles.gratitudeContainer}>
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
              if (
                index === gratitude.length - 1 &&
                item.trim() !== ""
              ) {
                onChange([...gratitude, ""]);

                requestAnimationFrame(() => {
                  inputRefs.current[index + 1]?.focus();
                });
              } else if (index < gratitude.length - 1) {
                inputRefs.current[index + 1]?.focus();
              }
            }}
          />

          {gratitude.length > 1 && (
            <Pressable
              onPress={() => {
                onChange(gratitude.filter((_, i) => i !== index));
              }}
            >
              <Ionicons
                style={styles.deleteButton}
                name="close-circle-outline"
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    gratitudeContainer: {
      padding: 24,
    },
    title: {
      alignSelf: "center",
      color: theme.text,
      fontWeight: "700",
      fontSize: 22,
      letterSpacing: -0.5,
      marginBottom: 12,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    input: {
      flex: 1,
    },
    deleteButton: {
      padding: 6,
    },
  });

export default GratitudeCard;
