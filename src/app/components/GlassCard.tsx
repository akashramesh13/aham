import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View, ViewProps } from "react-native";
import useTheme from "../hooks/useTheme";

interface GlassCardProps extends ViewProps {
  intensity?: number;
}

export default function GlassCard({
  children,
  style,
  intensity = 40,
  ...rest
}: GlassCardProps) {
  const { theme } = useTheme();

  const isLight = theme.background === "#F5F5F7";

  const cardStyle = [
    styles.card,
    {
      backgroundColor: Platform.OS === "web" ? theme.glassBackground : "transparent",
      borderColor: theme.glassBorder,

      shadowColor: isLight ? "#88A1B5" : "#000000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: isLight ? 0.08 : 0.4,
      shadowRadius: 32,
      elevation: isLight ? 8 : 12,
    },
    style,
  ];

  if (Platform.OS === "web") {
    return (
      <View
        style={[
          cardStyle,
          {
            backdropFilter: `blur(${intensity}px) saturate(200%)`,
            WebkitBackdropFilter: `blur(${intensity}px) saturate(200%)`,
          } as any,
        ]}
        {...rest}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      tint={isLight ? "light" : "dark"}
      intensity={intensity}
      style={cardStyle}
      {...rest}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 18,
  },
});
