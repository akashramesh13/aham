import { Theme } from "@/types/theme";
import { ScrollView, StyleSheet, Text, View, Platform, Alert, Switch, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { writeAsStringAsync, documentDirectory, EncodingType } from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppHeader from "../components/AppHeader";
import CustomButton from "../components/CustomButton";
import RadioList from "../components/RadioList";
import useTheme from "../hooks/useTheme";
import { JournalService } from "@/backend/services/JournalService";
import AmbientBackground from "../components/AmbientBackground";
import { NotificationService } from "@/backend/services/NotificationService";

export default function Settings() {
  const { mode, setTheme, theme } = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  
  const [showLaunchAlways, setShowLaunchAlways] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      // Reminders
      if (Platform.OS !== "web") {
        const enabled = await NotificationService.isReminderEnabled();
        setReminderEnabled(enabled);
        const { hour, minute } = await NotificationService.getReminderTime();
        const d = new Date();
        d.setHours(hour, minute, 0, 0);
        setReminderTime(d);
      }
      
      // Launch Animation
      const launchSetting = await AsyncStorage.getItem("showLaunchAlways");
      setShowLaunchAlways(launchSetting === "true");
    };
    loadSettings();
  }, []);

  const toggleLaunchAlways = async (val: boolean) => {
    setShowLaunchAlways(val);
    await AsyncStorage.setItem("showLaunchAlways", String(val));
    if (val) {
      // If they enable 'Always Show', we should clear the 'hasSeen' flag 
      // just to be safe, though the layout logic will handle it primarily.
      await AsyncStorage.removeItem("hasSeenLaunch");
    }
  };

  const toggleReminder = async (val: boolean) => {
    setReminderEnabled(val);
    await NotificationService.setReminderEnabled(val);
    if (val) {
      const granted = await NotificationService.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission Required", "Please enable notifications in your settings.");
        setReminderEnabled(false);
        await NotificationService.setReminderEnabled(false);
        return;
      }
      await NotificationService.scheduleDailyReminder(reminderTime.getHours(), reminderTime.getMinutes());
    } else {
      await NotificationService.cancelReminders();
    }
  };

  const onChangeTime = async (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      setReminderTime(selectedDate);
      const h = selectedDate.getHours();
      const m = selectedDate.getMinutes();
      await NotificationService.setReminderTime(h, m);
      if (reminderEnabled) {
        await NotificationService.scheduleDailyReminder(h, m);
      }
    }
  };

  const styles = createStyles(theme);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = await JournalService.exportAllData();

      if (Platform.OS === "web") {
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `aham_export_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const fileUri = `${documentDirectory}aham_export.json`;
        await writeAsStringAsync(fileUri, data, { encoding: EncodingType.UTF8 });
        await Sharing.shareAsync(fileUri);
      }
    } catch (e) {
      console.error("Export failed:", e);
      Alert.alert("Export Failed", "There was an error generating your backup.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AmbientBackground />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <AppHeader title="Settings" />
        <View style={styles.section}>
          <Text style={styles.heading}>Appearance</Text>
          <RadioList
            value={mode}
            onChange={setTheme}
            options={[
              { value: "system", label: "Follow System Theme" },
              { value: "light", label: "Light" },
              { value: "terminal", label: "Terminal (Dark)" },
            ]}
          />
          <View style={[styles.row, { marginTop: 16, flexDirection: 'column', alignItems: 'flex-start', gap: 12 }]}>
            <Text style={[styles.label, { fontSize: 18, marginBottom: 0 }]}>Always Show Intro Animation</Text>
            <View style={{
              borderWidth: 2,
              borderColor: theme.accent,
              borderRadius: 16,
              padding: 2,
              backgroundColor: theme.glassBackground,
              alignSelf: 'flex-start'
            }}>
              <Switch
                value={showLaunchAlways}
                onValueChange={toggleLaunchAlways}
                trackColor={{ true: theme.accent, false: 'transparent' }}
                thumbColor={theme.text}
              />
            </View>
          </View>
        </View>

        {Platform.OS !== "web" && (
          <View style={styles.section}>
            <Text style={styles.heading}>Reminders</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Daily Journal Reminder</Text>
              <Switch
                value={reminderEnabled}
                onValueChange={toggleReminder}
                trackColor={{ true: theme.accent }}
              />
            </View>

            {reminderEnabled && (
              <View style={[styles.row, { marginTop: 16 }]}>
                <Text style={styles.label}>Reminder Time</Text>
                {Platform.OS === "ios" ? (
                  <DateTimePicker
                    value={reminderTime}
                    mode="time"
                    display="default"
                    onChange={onChangeTime}
                    themeVariant={mode === "light" ? "light" : "dark"}
                  />
                ) : (
                  <Pressable onPress={() => setShowPicker(true)} style={styles.timeButton}>
                    <Text style={styles.timeText}>
                      {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </Pressable>
                )}
                
                {Platform.OS === "android" && showPicker && (
                  <DateTimePicker
                    value={reminderTime}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={onChangeTime}
                  />
                )}
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.heading}>Export</Text>
          <CustomButton
            value="Export to JSON"
            fontFamily="monospace"
            onPress={handleExport}
            isLoading={isExporting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },
    heading: {
      color: theme.text,
      fontWeight: "600",
      fontSize: 24,
      marginBottom: 10,
    },
    section: {
      marginTop: 20,
      marginBottom: 20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    label: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "500",
    },
    timeButton: {
      backgroundColor: theme.accent + "22",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.accent,
    },
    timeText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "600",
    },
  });
