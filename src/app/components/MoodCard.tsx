import { StyleSheet, Text, View } from "react-native";

import { moods } from "@/constants/mood";
import { MoodCardProps } from "@/types/mood";
import { Theme } from "@/types/theme";
import useTheme from "../hooks/useTheme";
import MoodButton from "./MoodButton";

export default function MoodCard({ value, onChange }: MoodCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>

      <View style={styles.card}>
        {moods.map((mood) => (
          <MoodButton
            key={mood.label}
            mood={mood}
            selected={value === mood.label}
            onPress={() => onChange(mood.label)}
          />
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      marginTop: 25,
    },

    title: {
      color: theme.text,
      fontFamily: "BodyFont-Bold",
      fontSize: 20,
    },

    card: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      alignSelf: "stretch",
      backgroundColor: theme.surface,
      borderRadius: 12,
      paddingVertical: 18,
      marginTop: 16,
    },
  });
