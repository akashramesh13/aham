import { lightTheme } from "@/styles/theme";
import { Pressable, StyleSheet, Text } from "react-native";
import useTheme from "../hooks/useTheme";

type CustomButtonProps = {
  value: string;
  fontFamily?: string;
};

export default function CustomButton({
  value,
  fontFamily = "monospace",
}: CustomButtonProps) {
  const { mode, setTheme, theme } = useTheme();

  const styles = createStyles(theme, fontFamily);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? theme.border : theme.text,
        },
      ]}
      onPress={() => alert("Pressed")}
    >
      <Text style={styles.text}>{value}</Text>
    </Pressable>
  );
}
const createStyles = (theme: typeof lightTheme, fontFamily?: string) =>
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
