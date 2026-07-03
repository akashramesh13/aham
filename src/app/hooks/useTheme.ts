import { useThemeContext } from "@/context/ThemeContext";
import { amoledTheme, darkTheme, lightTheme } from "@/styles/theme";
import { useColorScheme } from "react-native";

export default function useTheme() {
  const system = useColorScheme();
  const { theme: mode, setTheme } = useThemeContext();

  const themes = {
    light: lightTheme,
    dark: darkTheme,
    amoled: amoledTheme,
  };

  const resolvedMode =
    mode === "system" ? (system === "dark" ? "dark" : "light") : mode;

  const activeTheme = themes[resolvedMode];

  return {
    theme: activeTheme,
    mode,
    setTheme,
  };
}
