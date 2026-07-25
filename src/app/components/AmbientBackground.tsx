import { StyleSheet, View } from "react-native";

import { Theme } from "@/types/theme";
import useTheme from "../hooks/useTheme";

export default function AmbientBackground() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.baseBg} />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      zIndex: -1,
    },
    baseBg: {
      ...StyleSheet.absoluteFill,
      backgroundColor: theme.background,
    },
  });
