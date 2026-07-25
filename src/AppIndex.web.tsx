import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import HomeView from "./app/components/views/HomeView";
import CalendarView from "./app/components/views/CalendarView";
import SettingsView from "./app/components/views/SettingsView";
import CustomTabBar from "./app/components/CustomTabBar";
import useTheme from "./app/hooks/useTheme";
import AmbientBackground from "./app/components/AmbientBackground";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppIndexWeb() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (params.tab === "calendar") {
      setActiveIndex(1);
    } else if (params.tab === "settings") {
      setActiveIndex(2);
    } else if (params.tab === "home") {
      setActiveIndex(0);
    }
  }, [params.tab]);

  const onTabPress = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
      <AmbientBackground />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.pagerView}>
          {activeIndex === 0 && <HomeView />}
          {activeIndex === 1 && <CalendarView />}
          {activeIndex === 2 && <SettingsView />}
        </View>
        
        <CustomTabBar activeIndex={activeIndex} onTabPress={onTabPress} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
});
