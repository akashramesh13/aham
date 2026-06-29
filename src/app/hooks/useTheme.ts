import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "@/styles/theme";
import { useThemeContext } from "@/context/ThemeContext";

export default function useTheme() {
  const system = useColorScheme();
  const { theme: mode, setTheme } = useThemeContext();

  const activeTheme =
    mode === "system"
      ? system === "dark"
        ? darkTheme
        : lightTheme
      : mode === "dark"
        ? darkTheme
        : lightTheme;

  return {
    theme: activeTheme,
    mode,
    setTheme,
  };
}
