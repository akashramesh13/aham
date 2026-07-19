import { HoursOfSleepCardProps } from "@/types/hoursOfSleep";
import { Theme } from "@/types/theme";
import { StyleSheet, Text, View, TextInput, Platform } from "react-native";
import useTheme from "../hooks/useTheme";

const HoursOfSleepCard = ({ value, onChange }: HoursOfSleepCardProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned === "") {
      onChange(null);
      return;
    }
    const num = parseInt(cleaned, 10);
    if (num >= 0 && num <= 24) {
      onChange(num);
    }
  };

  return (
    <View style={styles.sleepContainer}>
      <Text style={styles.title}>Hours of Sleep</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null,
          ]}
          keyboardType="numeric"
          value={value === null || value === undefined ? "" : String(value)}
          onChangeText={handleChange}
          placeholder="8"
          placeholderTextColor={theme.textSecondary}
          selectionColor={theme.accent}
          maxLength={2}
          underlineColorAndroid="transparent"
        />
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    sleepContainer: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
    },
    title: {
      color: theme.textSecondary,
      fontWeight: "600",
      fontSize: 14,
      textTransform: "uppercase",
      letterSpacing: 1,
      textAlign: "center",
      marginBottom: 20,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      fontSize: 48,
      fontWeight: "800",
      color: theme.text,
      textAlign: "center",
      minWidth: 64,
      padding: 0,
      margin: 0,
    },
    unit: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.textSecondary,
      marginLeft: 4,
      marginTop: 16,
    },
  });

export default HoursOfSleepCard;
