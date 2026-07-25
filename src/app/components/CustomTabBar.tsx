import { View, Pressable, StyleSheet, Platform, LayoutChangeEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import { Theme } from "@/types/theme";
import GlassCard from "./GlassCard";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useState } from "react";

const TAB_WIDTH = 60;

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(state.index * 68, {
            damping: 30,
            stiffness: 250,
            mass: 0.8,
          }),
        },
      ],
    };
  });

  return (
    <View style={styles.container} pointerEvents="box-none">
      <GlassCard style={styles.pill}>
        <Animated.View style={[styles.indicator, animatedIndicatorStyle]} />

        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          let iconName: keyof typeof Ionicons.glyphMap = isFocused ? "home" : "home-outline";
          if (route.name === "calendar") iconName = isFocused ? "calendar" : "calendar-outline";
          else if (route.name === "settings") iconName = isFocused ? "options" : "options-outline";

          return (
            <Pressable
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
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
