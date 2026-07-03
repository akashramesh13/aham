import { CustomChecklistProps } from "@/types/customChecklist";
import { Theme } from "@/types/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { forwardRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import useTheme from "../hooks/useTheme";
import CustomTextInput from "./CustomTextInput";

const CustomChecklist = forwardRef<TextInput, CustomChecklistProps>(
  ({ checked, value, onToggle, onValueChange, ...props }, ref) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const iconName = checked ? "checkbox-marked" : "checkbox-blank-outline";

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
        >
          <MaterialCommunityIcons
            name={iconName}
            size={24}
            color={value.trim().length === 0 ? theme.textSecondary : theme.text}
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
      gap: 8,
    },

    input: {
      flex: 1,
    },
  });
