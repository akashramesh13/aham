import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../AppHeader";
import AmbientBackground from "../AmbientBackground";
import TodayOverview from "../TodayOverview";
import useTheme from "../../hooks/useTheme";
import { Theme } from "@/types/theme";
import { StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

import { useState } from "react";

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { date } = useLocalSearchParams<{ date?: string }>();
  
  /** Return YYYY-MM-DD in the device's local timezone (not UTC). */
  const today = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();
  const [isEditingPast, setIsEditingPast] = useState(false);
  const isReadOnly = date && date !== today && !isEditingPast;

  return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <AmbientBackground />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <AppHeader title="अहम्" />
          <TodayOverview isEditingPast={isEditingPast} setIsEditingPast={setIsEditingPast} />
        </KeyboardAwareScrollView>
      </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 80,
    },
  });
