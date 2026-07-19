import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Theme } from "@/types/theme";
import useTheme from "../hooks/useTheme";

export default function AmbientBackground() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const isLight = theme.background === "#F5F5F7";
  
  // More noticeable contrast for the pulse
  const glowColor = isLight ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.15)";
  const shadowColor = isLight ? "rgba(0, 0, 0, 0.04)" : "transparent";

  const translateY = useSharedValue(-50);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    translateY.value = withRepeat(
      withSequence(
        withTiming(50, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-50, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.baseBg} />
      <Animated.View style={[styles.blob, animatedStyle]}>
        <LinearGradient
          colors={[shadowColor, glowColor, shadowColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
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
      zIndex: -1,
    },
    baseBg: {
      ...StyleSheet.absoluteFill,
      backgroundColor: theme.background,
    },
    blob: {
      position: "absolute",
      width: "150%",
      height: "200%",
      top: "-50%",
      left: "-25%",
    },
  });
