import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getTheme, saveTheme, ThemeMode } from "@/storage/theme";

type ThemeContextType = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => Promise<void>;
  loading: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await getTheme();
      setThemeState(storedTheme);
      setLoading(false);
    };

    loadTheme();
  }, []);

  if (loading) {
    return null;
  }

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    await saveTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used inside ThemeProvider");
  }

  return context;
}
