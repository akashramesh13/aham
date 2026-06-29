import { ScrollView, StyleSheet, Text } from "react-native";
import useTheme from "../hooks/useTheme";
import { lightTheme } from "@/styles/theme";

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Journal 📓</Text>
    </ScrollView>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 16,
      paddingTop: 60,
      paddingHorizontal: 20,
    },
    title: {
      color: theme.text,
    },
  });
