import { HoursOfSleepCardProps } from "@/types/hoursOfSleep";
import { Theme } from "@/types/theme";
import { StyleSheet, Text, View } from "react-native";
import useTheme from "../hooks/useTheme";
import CustomTextInput from "./CustomTextInput";

const HoursOfSleepCard = ({ value, onChange }: HoursOfSleepCardProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.sleepContainer}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        style={styles.title}
      >
        Hours of Sleep
      </Text>
      <CustomTextInput
        style={{ textAlign: "center", fontSize: 25 }}
        value={value?.toString() ?? ""}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9.]/g, "");
          onChange(cleaned === "" ? null : Number(cleaned));
        }}
      />
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    sleepContainer: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      flexDirection: "column",
      minHeight: 190,
    },
    title: {
      fontSize: 18,
      fontFamily: "BodyFont-Bold",
      color: theme.text,
    },
    input: {
      width: "100%",
    },
  });

export default HoursOfSleepCard;
