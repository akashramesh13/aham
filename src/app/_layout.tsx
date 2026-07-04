import { migrateDatabase } from "@/backend/database/migrate";
import { ThemeProvider } from "@/context/ThemeContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "TitleFont-Regular": require("../../assets/fonts/PlayfairDisplay/PlayfairDisplay-Regular.ttf"),
    "TitleFont-Bold": require("../../assets/fonts/PlayfairDisplay/PlayfairDisplay-Bold.ttf"),
    "BodyFont-Regular": require("../../assets/fonts/LibreBaskerville/LibreBaskerville-Regular.ttf"),
    "BodyFont-Bold": require("../../assets/fonts/LibreBaskerville/LibreBaskerville-Bold.ttf"),
  });

  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    async function init() {
      console.log("Starting init...");
      console.log("Fonts loaded:", loaded);

      try {
        console.log("Running migrations...");
        await migrateDatabase();
        console.log("✅ DB Ready");
      } catch (e) {
        console.error("Migration failed:", e);
      } finally {
        console.log("Finishing init");
        setDatabaseReady(true);
        await SplashScreen.hideAsync();
      }
    }

    if (loaded || error) {
      init();
    }
  }, [loaded, error]);
  if (!loaded || !databaseReady) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
