import { ThemeMode } from "@/types/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "theme";

export const getTheme = async (): Promise<ThemeMode> => {
  const value = await AsyncStorage.getItem(THEME_KEY);

  if (value === "light" || value === "terminal" || value === "system") {
    return value;
  }

  return "system";
};

export const saveTheme = async (theme: ThemeMode) => {
  await AsyncStorage.setItem(THEME_KEY, theme);
};
