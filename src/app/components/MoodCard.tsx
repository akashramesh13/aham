import { moods } from "@/constants/mood";
import { MoodCardProps } from "@/types/mood";
import { Theme } from "@/types/theme";
import { StyleSheet, Text, View } from "react-native";

import useTheme from "../hooks/useTheme";
import GlassCard from "./GlassCard";
import MoodButton from "./MoodButton";

export default function MoodCard({ value, onChange }: MoodCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <GlassCard>
      <Text style={styles.title}>Mood</Text>

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
    </GlassCard>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    title: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 1,
      textAlign: "center",
      marginBottom: 20,
    },

    buttonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
