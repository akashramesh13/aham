import { ThemeProvider } from "@/context/ThemeContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "TitleFont-Regular": require("../../assets/fonts/PlayfairDisplay/PlayfairDisplay-Regular.ttf"),
    "TitleFont-Bold": require("../../assets/fonts/PlayfairDisplay/PlayfairDisplay-Bold.ttf"),
    "BodyFont-Regular": require("../../assets/fonts/LibreBaskerville/LibreBaskerville-Regular.ttf"),
    "BodyFont-Bold": require("../../assets/fonts/LibreBaskerville/LibreBaskerville-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
