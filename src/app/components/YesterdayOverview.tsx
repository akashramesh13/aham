import { Theme } from "@/types/theme";
import { StyleSheet, Text, View } from "react-native";
import useTheme from "../hooks/useTheme";

const YesterdayOverview = () => {
  const sleepHours = 8;
  const tasksCompleted = 5;
  const totalTasks = 10;
  const mood = "🙂";

  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Yesterday</Text>

      <Text style={styles.text}>Sleep: {sleepHours}H</Text>

      <Text style={styles.text}>
        Tasks: {tasksCompleted}/{totalTasks}
      </Text>

      <Text style={styles.text}>Mood: {mood}</Text>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: 4,
    },
    heading: {
      color: theme.text,
      fontWeight: "600",
      fontSize: 18,
      marginBottom: 4,
    },
    text: {
      color: theme.textSecondary,
      fontWeight: "400",
      fontSize: 15,
    },
  });

export default YesterdayOverview;
