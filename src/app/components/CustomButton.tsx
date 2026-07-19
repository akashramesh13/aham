import { Theme } from "@/types/theme";
import { Pressable, StyleSheet, Text } from "react-native";
import useTheme from "../hooks/useTheme";
import { CustomButtonProps } from "@/types/customButton";

export default function CustomButton({
  value,
  fontFamily = "monospace",
  onPress,
  isLoading,
}: CustomButtonProps & { onPress?: () => void; isLoading?: boolean }) {
  const { theme } = useTheme();

  const styles = createStyles(theme, fontFamily);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.accent,
          opacity: pressed || isLoading ? 0.7 : 1,
        },
      ]}
      onPress={onPress}
      disabled={isLoading}
    >
      <Text style={styles.text}>{isLoading ? "Exporting..." : value}</Text>
    </Pressable>
  );
}
const createStyles = (theme: Theme, fontFamily?: string) =>
  StyleSheet.create({
    button: {
      backgroundColor: theme.text,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonPressed: {
      opacity: 0.7,
    },
    text: {
      color: theme.background,
      fontSize: 18,
      fontWeight: "600",
      fontFamily: fontFamily,
    },
  });
