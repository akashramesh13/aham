import { lightTheme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import useTheme from "../hooks/useTheme";
import CustomTextInput from "./CustomTextInput";

const GratitudeCard = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [gratitude, setGratitude] = useState([""]);
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
            placeholder="Grateful for..."
            onChangeText={(text) => {
              const next = [...gratitude];
              next[index] = text;
              setGratitude(next);
            }}
            returnKeyType={index === 2 ? "done" : "next"}
            onSubmitEditing={() => {
              if (
                index === gratitude.length - 1 &&
                gratitude.length < 3 &&
                item.trim() !== ""
              ) {
                setGratitude((prev) => [...prev, ""]);

                requestAnimationFrame(() => {
                  inputRefs.current[index + 1]?.focus();
                });
              }
            }}
          />

          {gratitude.length > 1 && item.trim() === "" && (
            <Pressable
              onPress={() => {
                setGratitude((prev) => prev.filter((_, i) => i !== index));
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

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    gratitudeContainer: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
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
