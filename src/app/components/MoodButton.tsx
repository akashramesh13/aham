import { MoodButtonProps } from "@/types/moodButton";
import { Theme } from "@/types/theme";
import { Ionicons } from "@expo/vector-icons";
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
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  const handlePress = () => {
    switch (mood.label) {
      case "happy":
        scale.value = withSequence(withSpring(1.45), withSpring(1));
        break;

      case "neutral":
        scale.value = withSequence(
          withTiming(1.15, { duration: 100 }),
          withTiming(1, { duration: 100 }),
        );
        break;

      case "sad":
        translateX.value = withSequence(
          withTiming(-4, { duration: 40 }),
          withTiming(4, { duration: 40 }),
          withTiming(-3, { duration: 40 }),
          withTiming(3, { duration: 40 }),
          withTiming(0, { duration: 40 }),
        );
        break;
    }

    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Select ${mood.label} mood`}
        accessibilityState={{ selected }}
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          selected && styles.selectedButton,
          pressed && styles.pressedButton,
        ]}
      >
        <Ionicons
          name={mood.icon}
          size={30}
          color={selected ? theme.background : theme.text}
        />

        <Text style={[styles.label, selected && styles.selectedLabel]}>
          {mood.display}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
    },

    selectedButton: {
      backgroundColor: theme.text,
    },

    pressedButton: {
      opacity: 0.75,
    },

    label: {
      marginTop: 6,
      color: theme.text,
      fontFamily: "BodyFont-Regular",
      fontSize: 12,
    },

    selectedLabel: {
      color: theme.background,
    },
  });
