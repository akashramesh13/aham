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
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { NotificationService } from "@/backend/services/NotificationService";

import LaunchScreen from "@/app/components/LaunchScreen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [showLaunch, setShowLaunch] = useState(true);

  const [loaded] = useFonts({
    "TitleFont-Bold": require("../../assets/fonts/Inter/Inter-Bold.ttf"),
    "TitleFont-Medium": require("../../assets/fonts/Inter/Inter-Medium.ttf"),
    "TitleFont-Regular": require("../../assets/fonts/Inter/Inter-Regular.ttf"),
    "CalendarFont-Bold": require("../../assets/fonts/Inter/Inter-Bold.ttf"),
    "CalendarFont-Medium": require("../../assets/fonts/Inter/Inter-Medium.ttf"),
    "CalendarFont-Regular": require("../../assets/fonts/Inter/Inter-Regular.ttf"),
  });

  useEffect(() => {
    async function prepareSystem() {
      // 1. Navigation Bar (Fragile on some Android skins, do not let it crash the boot process)
      try {
        if (Platform.OS === "android") {
          await NavigationBar.setPositionAsync("absolute");
          await NavigationBar.setVisibilityAsync("hidden");
          await NavigationBar.setBehaviorAsync("overlay-swipe");
        }
      } catch (e) {
        console.log("NavigationBar API not supported on this device:", e);
      }

      // 2. Notifications
      try {
        NotificationService.init();
      } catch (e) {
        console.log("Notification init failed:", e);
      }
      
      // 3. Launch Screen Toggle
      try {
        const showLaunchAlways = await AsyncStorage.getItem("showLaunchAlways");
        if (showLaunchAlways === "false") {
          setShowLaunch(false);
        } else {
          setShowLaunch(true);
        }
      } catch (e) {
        console.log("Failed to read showLaunchAlways:", e);
      }

      // 4. Database Migrations
      try {
        if (Platform.OS !== "web") {
          console.log("Running migrations...");
          await migrateDatabase();
          console.log("✅ DB Ready");
        }
      } catch (e) {
        console.error("Migration failed:", e);
      }

      // 5. Finalize Boot
      setIsReady(true);
    }

    prepareSystem();
  }, []);

  useEffect(() => {
    if (loaded && isReady && !showLaunch) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isReady, showLaunch]);

  if (!isReady || !loaded) {
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
          <StatusBar hidden />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
            <Stack.Screen name="index" />
          </Stack>
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
