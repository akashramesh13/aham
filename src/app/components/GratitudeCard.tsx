import { GratitudeCardProps } from "@/types/gratitudeCard";
import { Theme } from "@/types/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import useTheme from "../hooks/useTheme";
import CustomTextInput from "./CustomTextInput";

const GratitudeCard = ({ gratitude, onChange }: GratitudeCardProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  return (
    <View style={styles.gratitudeContainer}>
      <Text style={styles.title}>Gratitude</Text>
      {/* <Text style={styles.subtitle}>What are you grateful for today ?</Text> */}
      {gratitude.map((item, index) => (
        <View key={index} style={styles.row}>
          <CustomTextInput
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={styles.input}
            value={item}
            placeholder={gratitude.length === 3 ? "" : "↵ to add more"}
            onChangeText={(text) => {
              const next = [...gratitude];
              next[index] = text;
              onChange(next);
            }}
            returnKeyType={index === 3 ? "done" : "next"}
            onSubmitEditing={() => {
              if (
                index === gratitude.length - 1 &&
                gratitude.length < 3 &&
                item.trim() !== ""
              ) {
                onChange([...gratitude, ""]);

                requestAnimationFrame(() => {
                  inputRefs.current[index + 1]?.focus();
                });
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
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      minHeight: 190,
    },
    title: {
      alignSelf: "center",
      color: theme.text,
      fontFamily: "BodyFont-Bold",
      fontSize: 20,
    },
    // subtitle: {
    //   alignSelf: "center",
    //   color: theme.text,
    //   fontFamily: "BodyFont-Regular",
    //   fontSize: 15,
    // },
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
