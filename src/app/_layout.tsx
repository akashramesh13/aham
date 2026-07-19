import { migrateDatabase } from "@/backend/database/migrate";
import { ThemeProvider } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotificationService } from "@/backend/services/NotificationService";

import LaunchScreen from "@/app/components/LaunchScreen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [showLaunch, setShowLaunch] = useState(true);

  useEffect(() => {
    async function prepareSystem() {
      try {
        NotificationService.init();
        const hasSeen = await AsyncStorage.getItem("hasSeenLaunch");
        if (hasSeen === "true") {
          setShowLaunch(false);
        }

        if (Platform.OS !== "web") {
          console.log("Running migrations...");
          await migrateDatabase();
          console.log("✅ DB Ready");
        }
      } catch (e) {
        console.error("Migration failed:", e);
      } finally {
        setIsReady(true);
      }
    }

    prepareSystem();
  }, []);

  if (!isReady) {
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
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
