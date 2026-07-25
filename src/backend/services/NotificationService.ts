import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REMINDER_ENABLED_KEY = "reminder_enabled";
const REMINDER_TIME_KEY = "reminder_time";

export class NotificationService {
  static async init() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("aham_daily", {
        name: "Daily Reminder",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#8A0322", // New accent color
        sound: "calm_chime.wav", // The custom sound
      });
    }
  }

  static async requestPermissionsAsync(): Promise<boolean> {
    if (Platform.OS === "web") return false;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === "granted";
  }

  static async scheduleDailyReminder(hour: number, minute: number) {
    if (Platform.OS === "web") return;
    
    // Always clear existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to reflect ✍️",
        body: "Take a moment to write down your journal entry and log your day.",
        sound: "calm_chime.wav", // Custom sound for iOS
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: "aham_daily", // Important for Android to use the new channel
      },
    });
  }

  static async cancelReminders() {
    if (Platform.OS === "web") return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // --- Storage Helpers ---
  
  static async isReminderEnabled(): Promise<boolean> {
    const val = await AsyncStorage.getItem(REMINDER_ENABLED_KEY);
    return val === "true";
  }

  static async setReminderEnabled(enabled: boolean) {
    await AsyncStorage.setItem(REMINDER_ENABLED_KEY, String(enabled));
  }

  static async getReminderTime(): Promise<{ hour: number; minute: number }> {
    const val = await AsyncStorage.getItem(REMINDER_TIME_KEY);
    if (val) {
      return JSON.parse(val);
    }
    return { hour: 20, minute: 0 }; // Default 8:00 PM
  }

  static async setReminderTime(hour: number, minute: number) {
    await AsyncStorage.setItem(REMINDER_TIME_KEY, JSON.stringify({ hour, minute }));
  }
}
