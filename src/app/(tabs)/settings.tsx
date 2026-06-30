import { lightTheme } from "@/styles/theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import RadioList from "../components/RadioList";
import useTheme from "../hooks/useTheme";

export default function Settings() {
  const { mode, setTheme, theme } = useTheme();

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Appearance</Text>
        <RadioList
          value={mode}
          onChange={setTheme}
          options={[
            { value: "system", label: "Follow System Theme" },
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
        <View style={styles.exportContainer}>
          <Text style={styles.heading}>Export</Text>
          <CustomButton value="Export to JSON" fontFamily="monospace" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },
    heading: {
      color: theme.text,
      fontFamily: "BodyFont-Bold",
      fontSize: 24,
      marginBottom: 10,
    },
    exportContainer: {
      marginTop: 50,
    },
  });
