import { StyleSheet, View } from "react-native";
import useTheme from "../hooks/useTheme";
import { Theme } from "@/types/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import Animated, { useSharedValue, withRepeat, withTiming, withSequence } from "react-native-reanimated";

export default function AmbientBackground() {
  const { theme, mode } = useTheme();
  const styles = createStyles(theme);

  const opacity = mode !== "light" ? "1A" : "0A";
  
  const animOpacity = useSharedValue(0.2);
  
  useEffect(() => {
    animOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000 }),
        withTiming(0.2, { duration: 4000 })
      ),
      -1,
      true
    );
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: animOpacity }]} pointerEvents="none">
      <LinearGradient
        colors={[theme.background, theme.accent + opacity, theme.background]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      backgroundColor: theme.background,
      zIndex: -1,
    },
  });
