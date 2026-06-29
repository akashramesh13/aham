import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "theme";

export type ThemeMode = "light" | "dark" | "system";

export const getTheme = async (): Promise<ThemeMode> => {
  const value = await AsyncStorage.getItem(THEME_KEY);

  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  return "system";
};

export const saveTheme = async (theme: ThemeMode) => {
  await AsyncStorage.setItem(THEME_KEY, theme);
};
