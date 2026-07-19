import { CustomChecklistProps } from "@/types/customChecklist";
import { Theme } from "@/types/theme";
import { Ionicons } from "@expo/vector-icons";
import { forwardRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import useTheme from "../hooks/useTheme";
import CustomTextInput from "./CustomTextInput";

const CustomChecklist = forwardRef<TextInput, CustomChecklistProps>(
  ({ checked, value, onToggle, onValueChange, ...props }, ref) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const iconName = checked ? "checkmark-circle" : "ellipse-outline";
    const iconColor = checked 
      ? theme.accent 
      : theme.textSecondary;

    return (
      <View style={styles.container}>
        <Pressable
          disabled={value.trim().length === 0}
          onPress={onToggle}
          accessibilityRole="checkbox"
          accessibilityState={{
            checked,
            disabled: value.trim().length === 0,
          }}
          style={value.trim().length === 0 ? { opacity: 0.3 } : null}
        >
          <Ionicons
            name={iconName}
            size={24}
            color={iconColor}
          />
        </Pressable>

        <CustomTextInput
          ref={ref}
          style={styles.input}
          value={value}
          onChangeText={onValueChange}
          {...props}
        />
      </View>
    );
  },
);

CustomChecklist.displayName = "CustomChecklist";

export default CustomChecklist;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      width: "100%",
    },

    input: {
      flex: 1,
      minWidth: 0,
    },
  });
