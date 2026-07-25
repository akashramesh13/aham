import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

import { JournalService } from "@/backend/services/JournalService";
import { Theme } from "@/types/theme";
import AmbientBackground from "../components/AmbientBackground";
import AppHeader from "../components/AppHeader";
import MonthYearPicker from "../components/MonthYearPicker";
import useTheme from "../hooks/useTheme";

export default function CalendarScreen() {
  const { theme, mode } = useTheme();
  const styles = createStyles(theme);

  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 10));
  // Track the date the user last tapped — persists across tab switches
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  // Build markedDates with today (accent text) + selected date (accent ring)
  const buildMarkedDates = () => {
    const result: Record<string, any> = {};

    // Copy journal-entry dots
    Object.keys(markedDates).forEach((d) => {
      result[d] = { ...markedDates[d] };
    });

    // Today: accent-colored text, no background
    result[today] = {
      ...(result[today] || {}),
      customStyles: {
        text: {
          color: theme.accent,
          fontWeight: "700" as const,
        },
      },
    };

    // Selected date (if different from today): accent ring/circle
    if (selectedDate && selectedDate !== today) {
      result[selectedDate] = {
        ...(result[selectedDate] || {}),
        customStyles: {
          container: {
            backgroundColor: theme.accent,
            borderWidth: 2,
            borderColor: theme.accent,
            alignItems: "center" as const,
            justifyContent: "center" as const,
          },
          text: {
            color: theme.background,
            fontWeight: "700" as const,
          },
        },
      };
    }

    return result;
  };

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
            testID="aham_calendar"
            key={currentMonth + mode}
            current={currentMonth}
            maxDate={today}
            hideExtraDays={true}
            disableArrowRight={currentMonth.startsWith(today.slice(0, 7))}
            markingType="custom"
            onMonthChange={(month: any) => setCurrentMonth(month.dateString)}
            renderHeader={renderCustomHeader}
            style={styles.calendar}
            theme={{
              backgroundColor: "transparent",
              calendarBackground: "transparent",
              textSectionTitleColor: theme.textSecondary,
              dayTextColor: theme.text,
              textDisabledColor: theme.textSecondary + "55",
              dotColor: theme.accent,
              arrowColor: theme.text,
              monthTextColor: theme.text,
              textDayFontWeight: "500",
              textMonthFontWeight: "800",
              textDayHeaderFontWeight: "700",
              textDayFontSize: 20,
              textMonthFontSize: 24,
              textDayFontFamily: "CalendarFont-Medium",
              textMonthFontFamily: "CalendarFont-Bold",
              textDayHeaderFontFamily: "CalendarFont-Medium",
              weekVerticalMargin: 12,
            }}
            markedDates={buildMarkedDates()}
            onDayPress={(day: any) => {
              setSelectedDate(day.dateString);
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
      paddingBottom: 130,
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
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    customHeaderText: {
      color: theme.text,
      fontSize: 18,
      fontWeight: "700",
    },
  });
