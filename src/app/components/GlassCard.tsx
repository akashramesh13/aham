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
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      overflow: "hidden",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 18,
      backgroundColor: theme.surface,
      ...Platform.select({
        ios: {
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.06,
          shadowRadius: 24,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        },
      }),
    },
  });
