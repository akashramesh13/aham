import { Theme } from "@/types/theme";
import { forwardRef } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import useTheme from "../hooks/useTheme";

type CustomTextInputProps = {
  value: string;
  onChangeText: (text: string) => void;
} & TextInputProps;

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(
  ({ value, onChangeText, style, ...props }, ref) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        selectionColor={theme.text}
        placeholderTextColor={theme.textSecondary}
        underlineColorAndroid="transparent"
        style={[styles.input, style]}
        {...props}
      />
    );
  },
);

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    input: {
      marginTop: 5,
      paddingVertical: 10,
      color: theme.text,
      borderBottomWidth: 1,
      borderBottomColor: theme.text,
      fontFamily: "BodyFont-Regular",
      fontSize: 16,
    },
  });

CustomTextInput.displayName = "CustomTextInput";
export default CustomTextInput;
