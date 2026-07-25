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
  
  const today = new Date().toISOString().slice(0, 10);
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
        
        {isReadOnly && (
          <Pressable
            style={({ pressed }) => [styles.floatingEditButton, pressed && styles.pressed]}
            onPress={() => setIsEditingPast(true)}
          >
            <Ionicons name="pencil" size={24} color={theme.accent} />
          </Pressable>
        )}
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
      paddingBottom: 130,
    },
    floatingEditButton: {
      position: "absolute",
      bottom: 100,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.surface,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    pressed: {
      opacity: 0.7,
      transform: [{ scale: 0.95 }],
    },
  });
