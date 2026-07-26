import { Platform, StyleSheet, View, ViewProps } from "react-native";
import useTheme from "../hooks/useTheme";
import { Theme } from "@/types/theme";

interface GlassCardProps extends ViewProps {
  intensity?: number;
}

export default function GlassCard({
  children,
  style,
  intensity,
  ...rest
}: GlassCardProps) {
  const { theme, resolvedMode } = useTheme();
  const styles = createStyles(theme, resolvedMode === "dark");

  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const createStyles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    card: {
      overflow: "hidden",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 18,
      backgroundColor: theme.surface,
    },
  });
