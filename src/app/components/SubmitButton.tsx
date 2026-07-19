import { SubmitButtonProps } from "@/types/submitButton";
import { Theme } from "@/types/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useTheme from "../hooks/useTheme";

const SubmitButton = ({ onPress }: SubmitButtonProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={onPress}
      >
        <Ionicons name="save-outline" size={36} color={theme.text} />
        <Text style={styles.text}>Save</Text>
      </Pressable>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    buttonContainer: {
      marginTop: 25,
      flexDirection: "column",
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surface,
      borderRadius: 12,
      paddingVertical: 14,
    },
    buttonPressed: {
      opacity: 0.7,
    },
    text: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "600",
    },
    saveIcon: {
      fontSize: 50,
      color: theme.text,
    },
  });

export default SubmitButton;
