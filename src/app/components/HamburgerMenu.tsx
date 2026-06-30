import { lightTheme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import useTheme from "../hooks/useTheme";
import { Pressable } from "react-native";

const HamburgerMenu = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <Pressable hitSlop={10} onPress={() => alert("Hamburger clicked")}>
      <Ionicons name="reorder-three-outline" size={32} color={theme.text} />
    </Pressable>
  );
};

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    hamburgerText: {
      color: theme.text,
    },
  });

export default HamburgerMenu;
