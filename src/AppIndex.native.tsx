import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import PagerView from "react-native-pager-view";
import { useLocalSearchParams, useRouter } from "expo-router";

import HomeView from "./app/components/views/HomeView";
import CalendarView from "./app/components/views/CalendarView";
import SettingsView from "./app/components/views/SettingsView";
import CustomTabBar from "./app/components/CustomTabBar";
import useTheme from "./app/hooks/useTheme";
import AmbientBackground from "./app/components/AmbientBackground";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppIndex() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const pagerRef = useRef<PagerView>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (params.tab === "calendar") {
      pagerRef.current?.setPage(1);
      setActiveIndex(1);
    } else if (params.tab === "settings") {
      pagerRef.current?.setPage(2);
      setActiveIndex(2);
    } else if (params.tab === "home") {
      pagerRef.current?.setPage(0);
      setActiveIndex(0);
    }
  }, [params.tab]);

  const onTabPress = (index: number) => {
    pagerRef.current?.setPage(index);
    setActiveIndex(index);
  };

  const onPageSelected = (e: any) => {
    setActiveIndex(e.nativeEvent.position);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
      <AmbientBackground />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={onPageSelected}
        >
          <View key="0" style={styles.page}>
            <HomeView />
          </View>
          <View key="1" style={styles.page}>
            <CalendarView />
          </View>
          <View key="2" style={styles.page}>
            <SettingsView />
          </View>
        </PagerView>
        
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
  page: {
    flex: 1,
  },
});
