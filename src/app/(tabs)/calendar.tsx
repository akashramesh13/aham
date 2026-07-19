import { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppHeader from "../components/AppHeader";
import useTheme from "../hooks/useTheme";
import { Theme } from "@/types/theme";
import { JournalService } from "@/backend/services/JournalService";
import AmbientBackground from "../components/AmbientBackground";
import MonthYearPicker from "../components/MonthYearPicker";

export default function CalendarScreen() {
  const { theme, mode } = useTheme();
  const styles = createStyles(theme);

  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 10));
  
  const today = new Date().toISOString().slice(0, 10);

  useFocusEffect(
    useCallback(() => {
      JournalService.getAllDates().then((dates) => {
        const marks: Record<string, any> = {};
        dates.forEach((d) => {
          marks[d] = { marked: true, dotColor: theme.accent };
        });
        setMarkedDates(marks);
      });
    }, [theme.accent])
  );

  const renderCustomHeader = (date: any) => {
    const month = date.toString("MMMM yyyy");
    return (
      <Pressable
        style={styles.customHeader}
        onPress={() => {
          setCurrentMonth(date.toString("yyyy-MM-dd"));
          setIsPickerVisible(true);
        }}
      >
        <Text style={styles.customHeaderText}>{month}</Text>
        <Ionicons name="chevron-down" size={16} color={theme.text} />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AmbientBackground />
      <AppHeader title="Calendar" />

      <View style={styles.content}>
        <Calendar
          key={currentMonth}
          current={currentMonth}
          maxDate={today}
          onMonthChange={(month: any) => setCurrentMonth(month.dateString)}
          renderHeader={renderCustomHeader}
          style={styles.calendar}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: theme.textSecondary,
            selectedDayBackgroundColor: theme.accent,
            selectedDayTextColor: theme.background,
            todayTextColor: theme.accent,
            dayTextColor: theme.text,
            textDisabledColor: theme.textSecondary,
            dotColor: theme.accent,
            selectedDotColor: theme.background,
            arrowColor: theme.text,
            monthTextColor: theme.text,
            textDayFontWeight: "500",
            textMonthFontWeight: "800",
            textDayHeaderFontWeight: "700",
            textDayFontSize: 18,
            textMonthFontSize: 22,
            textDayFontFamily: "TitleFont-Medium",
            textMonthFontFamily: "TitleFont-Bold",
            textDayHeaderFontFamily: "TitleFont-Medium",
          }}
          markedDates={{
            ...markedDates,
            [today]: {
              ...markedDates[today],
              selected: true,
              selectedColor: theme.accent + "40",
            },
          }}
          onDayPress={(day: any) => {
            router.push({
              pathname: "/(tabs)",
              params: { date: day.dateString },
            });
          }}
        />
      </View>

      <MonthYearPicker
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        currentDate={currentMonth}
        onSelect={(date) => {
          setCurrentMonth(date);
        }}
      />
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
      flex: 1,
      paddingTop: 16,
      paddingHorizontal: 16,
    },
    calendar: {
      borderRadius: 16,
      overflow: "hidden",
    },
    customHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: theme.glassBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.glassBorder,
    },
    customHeaderText: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "700",
    },
  });
