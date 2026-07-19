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
      <View style={styles.card}>
        <View style={styles.buttonsRow}>
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
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    title: {
      color: theme.text,
      fontWeight: "700",
      fontSize: 16,
      letterSpacing: -0.5,
      textAlign: "center",
    },

    card: {
      flex: 1,
      padding: 16,
      minHeight: 180,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },

    buttonsRow: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      alignSelf: "stretch",
      marginTop: 20,
    },
  });
