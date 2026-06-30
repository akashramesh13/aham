import { lightTheme } from "@/styles/theme";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { moods } from "../../../constants";
import useTheme from "../hooks/useTheme";
import MoodButton from "./MoodButton";

type MoodLabel = (typeof moods)[number]["label"];

const MoodCard = () => {
  const [selectedMood, setSelectedMood] = useState<MoodLabel | null>(null);

  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood</Text>
      <Text style={styles.subtitle}>Choose your mood today</Text>

      <View style={styles.card}>
        {moods.map((mood) => (
          <MoodButton
            key={mood.label}
            mood={mood}
            selected={selectedMood === mood.label}
            onPress={() => setSelectedMood(mood.label)}
          />
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: typeof lightTheme) =>
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

    subtitle: {
      color: theme.textSecondary,
      fontFamily: "BodyFont-Regular",
      fontSize: 15,
      marginTop: 4,
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

export default MoodCard;
