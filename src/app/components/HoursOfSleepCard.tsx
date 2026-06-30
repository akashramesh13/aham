import { lightTheme } from "@/styles/theme";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import useTheme from "../hooks/useTheme";
import CustomTextInput from "./CustomTextInput";

const HoursOfSleepCard = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [hoursOfSleep, setHoursOfSleep] = useState("");
  return (
    <View style={styles.sleepContainer}>
      <Text style={styles.title}>Hours of Sleep</Text>
      <CustomTextInput
        placeholder="Hours of sleep"
        value={hoursOfSleep}
        numberOfLines={1}
        onChangeText={(text) => setHoursOfSleep(text.replace(/[^0-9.]/g, ""))}
        keyboardType="decimal-pad"
        style={styles.input}
      />
    </View>
  );
};

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    sleepContainer: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      flexDirection: "column",
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
