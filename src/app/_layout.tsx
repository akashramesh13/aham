import AsyncStorage from "@react-native-async-storage/async-storage";
import { migrateDatabase } from "@/backend/database/migrate";
import { ThemeProvider } from "@/context/ThemeContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LaunchScreen from "@/app/components/LaunchScreen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "TitleFont-Regular": require("../../assets/fonts/PlayfairDisplay/PlayfairDisplay-Regular.ttf"),
    "TitleFont-Bold": require("../../assets/fonts/PlayfairDisplay/PlayfairDisplay-Bold.ttf"),
    "BodyFont-Regular": require("../../assets/fonts/LibreBaskerville/LibreBaskerville-Regular.ttf"),
    "BodyFont-Bold": require("../../assets/fonts/LibreBaskerville/LibreBaskerville-Bold.ttf"),
  });

  const [databaseReady, setDatabaseReady] = useState(false);
  const [showLaunch, setShowLaunch] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        if (Platform.OS !== "web") {
          console.log("Running migrations...");
          await migrateDatabase();
          console.log("✅ DB Ready");
        }
        if (showLaunch) {
          return (
            <LaunchScreen
              onFinish={() => {
                setShowLaunch(false);
              }}
            />
          );
        }
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

  if (showLaunch) {
    return (
      <LaunchScreen
        onFinish={async () => {
          await AsyncStorage.setItem("hasSeenLaunch", "true");
          setShowLaunch(false);
        }}
      />
    );
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
