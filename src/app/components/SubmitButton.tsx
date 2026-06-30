import { SubmitButtonProps } from "@/types/submitButton";
import { Theme } from "@/types/theme";
import { Pressable, StyleSheet, Text } from "react-native";
import useTheme from "../hooks/useTheme";

const SubmitButton = ({ entry }: SubmitButtonProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? theme.border : theme.text,
        },
      ]}
      onPress={() => alert(JSON.stringify(entry, null, 2))}
    >
      <Text style={styles.text}>{JSON.stringify(entry, null, 2)}</Text>
    </Pressable>
  );
};

const createStyles = (theme: Theme) =>
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
      fontFamily: "BodyFont-Regular",
    },
  });

export default SubmitButton;
