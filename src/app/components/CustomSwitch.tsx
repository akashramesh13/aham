import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import useTheme from "../hooks/useTheme";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 32;
const THUMB_SIZE = 24;
const PADDING = (TRACK_HEIGHT - THUMB_SIZE) / 2;

export default function CustomSwitch({ value, onValueChange }: CustomSwitchProps) {
  const { theme } = useTheme();
  
  // 0 is OFF, 1 is ON
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 120,
      overshootClamping: false,
    });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [theme.surface2, theme.accent]
    );

    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [theme.border, theme.accent]
    );

    return {
      backgroundColor,
      borderColor,
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    const translateX = progress.value * (TRACK_WIDTH - THUMB_SIZE - PADDING * 2);
    
    // In dark mode, white thumb looks best on accent.
    // In light mode, surface (white) thumb looks best on accent.
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [theme.textSecondary, theme.background] // Gray when off, background/white when on
    );

    return {
      transform: [{ translateX }],
      backgroundColor,
    };
  });

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onValueChange(!value);
      }}
      style={styles.pressable}
      hitSlop={10}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    justifyContent: "center",
    alignItems: "center",
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    borderWidth: 2,
    padding: PADDING,
    justifyContent: "center",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
