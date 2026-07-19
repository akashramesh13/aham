import { MoodButtonProps } from "@/types/moodButton";
import { Theme } from "@/types/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import useTheme from "../hooks/useTheme";

export default function MoodButton({
  mood,
  selected,
  onPress,
}: MoodButtonProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 12, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 250 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[styles.button, selected && styles.selected]}
    >
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <Ionicons
          name={mood.icon}
          size={32}
          color={selected ? theme.accent : theme.textSecondary}
        />
      </Animated.View>
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {mood.label}
      </Text>
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      borderRadius: 16,
      minWidth: 80,
    },
    selected: {
      backgroundColor: theme.accent + "22",
    },
    iconContainer: {
      marginBottom: 8,
    },
    label: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: "500",
    },
    labelSelected: {
      color: theme.accent,
      fontWeight: "700",
    },
  });
