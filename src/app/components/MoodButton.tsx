import { Mood } from "@/types/mood";
import { Theme } from "@/types/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import useTheme from "../hooks/useTheme";

type MoodButtonProps = {
  mood: Mood;
  selected: boolean;
  onPress: () => void;
};

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

  const handlePress = () => {
    // eslint-disable-next-line
    scale.value = withSequence(withSpring(1.15), withSpring(1));
    onPress();
  };

  return (
    <>
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
    </>
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
