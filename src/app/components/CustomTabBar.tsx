import { View, Pressable, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import useTheme from "../hooks/useTheme";
import { Theme } from "@/types/theme";
import GlassCard from "./GlassCard";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Keyboard } from "react-native";

const TAB_WIDTH = 60;

export default function CustomTabBar({ activeIndex, onTabPress }: { activeIndex: number, onTabPress: (index: number) => void }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, Platform.OS === "ios" ? 8 : 12) + 8;
  const styles = createStyles(theme, bottomOffset);

  // Keyboard-aware visibility
  const keyboardVisible = useSharedValue(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => { keyboardVisible.value = withTiming(1, { duration: 200 }); }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => { keyboardVisible.value = withTiming(0, { duration: 200 }); }
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          keyboardVisible.value,
          [0, 1],
          [0, 120],
          Extrapolation.CLAMP
        ),
      },
    ],
    opacity: interpolate(
      keyboardVisible.value,
      [0, 0.5],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(activeIndex * 68, {
            damping: 30,
            stiffness: 250,
            mass: 0.8,
          }),
        },
      ],
    };
  });

  const routes = [
    { key: 'home', icon: 'home', iconOutline: 'home-outline' },
    { key: 'calendar', icon: 'calendar', iconOutline: 'calendar-outline' },
    { key: 'settings', icon: 'options', iconOutline: 'options-outline' },
  ] as const;

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]} pointerEvents="box-none">
      <GlassCard style={styles.pill}>
        <Animated.View style={[styles.indicator, animatedIndicatorStyle]} />

        {routes.map((route, index) => {
          const isFocused = activeIndex === index;

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onTabPress(index);
          };

          const iconName: any = isFocused ? route.icon : route.iconOutline;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tab}
            >
              <AnimatedIcon
                name={iconName}
                size={24}
                color={isFocused ? theme.accent : theme.textSecondary}
                isFocused={isFocused}
              />
            </Pressable>
          );
        })}
      </GlassCard>
    </Animated.View>
  );
}

function AnimatedIcon({ name, size, color, isFocused }: any) {
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isFocused ? 1.15 : 1, {
            damping: 30,
            stiffness: 250,
            mass: 0.8,
          }),
        },
      ],
    };
  });

  return (
    <Animated.View style={[animatedIconStyle, { width: 24, height: 24, alignItems: "center", justifyContent: "center" }]}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}

const createStyles = (theme: Theme, bottomOffset: number) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: bottomOffset,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      elevation: 100,
    },
    pill: {
      flexDirection: "row",
      backgroundColor: theme.surface,
      borderRadius: 40,
      padding: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    indicator: {
      position: "absolute",
      left: 12,
      width: TAB_WIDTH,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.accent + "22",
    },
    tab: {
      width: TAB_WIDTH,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 4,
    },
  });
