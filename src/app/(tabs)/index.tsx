import { Theme } from "@/types/theme";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import TodayOverview from "../components/TodayOverview";
import useTheme from "../hooks/useTheme";

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader title={"अहम्"} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* <YesterdayOverview /> */}
        <TodayOverview />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: 20,
    },
  });
