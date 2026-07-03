import { ThemeMode } from "./theme";

export type ThemeContextType = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => Promise<void>;
  loading: boolean;
};
