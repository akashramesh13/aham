import React from "react";

import { ScrollView, StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";
import RadioList from "../components/RadioList";
import { lightTheme } from "@/styles/theme";

export default function Settings() {
  const { mode, setTheme, theme } = useTheme();

  const styles = createStyles(theme);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <RadioList
        value={mode}
        onChange={setTheme}
        options={[
          { value: "system", label: "Follow System Theme" },
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]}
      />
    </ScrollView>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 16,
      paddingTop: 300,
      paddingHorizontal: 20,
    },
  });
