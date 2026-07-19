import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View, ViewProps } from "react-native";
import useTheme from "../hooks/useTheme";

interface GlassCardProps extends ViewProps {
  intensity?: number;
}

export default function GlassCard({
  style,
  children,
  intensity = 40,
  ...rest
}: GlassCardProps) {
  const { theme, mode } = useTheme();

  if (Platform.OS === "web") {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.glassBackground,
            borderColor: theme.glassBorder,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            backdropFilter: `blur(${intensity / 2}px)`,
            WebkitBackdropFilter: `blur(${intensity / 2}px)`,
          } as any,
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={mode === "light" ? intensity : intensity / 2}
      tint={"default" as any}
      style={[
        styles.card,
        {
          backgroundColor: theme.glassBackground,
          borderColor: theme.glassBorder,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 5,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
    overflow: "hidden",
  },
});
