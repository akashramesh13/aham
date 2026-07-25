import { View, Pressable, StyleSheet, Platform, LayoutChangeEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import { Theme } from "@/types/theme";
import GlassCard from "./GlassCard";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useState } from "react";

const TAB_WIDTH = 60;

export default function CustomTabBar({ activeIndex, onTabPress }: { activeIndex: number, onTabPress: (index: number) => void }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

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
    <View style={styles.container} pointerEvents="box-none">
      <GlassCard style={styles.pill}>
        <Animated.View style={[styles.indicator, animatedIndicatorStyle]} />

        {routes.map((route, index) => {
          const isFocused = activeIndex === index;

          const onPress = () => {
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
    </View>
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

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: Platform.OS === "ios" ? 32 : 24,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
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
