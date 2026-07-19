import { useThemeContext } from "@/context/ThemeContext";
import { lightTheme, terminalTheme } from "@/styles/theme";
import { useColorScheme } from "react-native";

export default function useTheme() {
  const system = useColorScheme();
  const { theme: mode, setTheme } = useThemeContext();

  const themes = {
    light: lightTheme,
    terminal: terminalTheme,
  };

  const resolvedMode =
    mode === "system" ? (system === "dark" ? "terminal" : "light") : mode;

  // Type assertion or runtime check in case stored mode is invalid
  const activeTheme = themes[resolvedMode as keyof typeof themes] || themes.light;

  return {
    theme: activeTheme,
    mode,
    setTheme,
  };
}
