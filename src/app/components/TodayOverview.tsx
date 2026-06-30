import { lightTheme } from "@/styles/theme";
import { StyleSheet, Text, View } from "react-native";
import useTheme from "../hooks/useTheme";
import GratitudeCard from "./GratitudeCard";
import HoursOfSleepCard from "./HoursOfSleepCard";
import MoodCard from "./MoodCard";

const TodayOverview = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>Today</Text>
      </View>

      <MoodCard />

      <View style={styles.topRow}>
        <GratitudeCard />
        <HoursOfSleepCard />
      </View>

      {/* <GoalsSection /> */}
      {/* <TodoSection /> */}
    </View>
  );
};

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      marginTop: 25,
    },
    title: {
      alignSelf: "center",
      color: theme.text,
      fontFamily: "BodyFont-Bold",
      fontSize: 25,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginTop: 24,
      gap: 16,
    },
  });

export default TodayOverview;
