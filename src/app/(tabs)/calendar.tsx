import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
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
        {Platform.OS === "web" && (
          <style type="text/css">{`
            [data-testid^="aham_calendar.day_"]:hover [data-testid$=".text"] {
              background-color: ${theme.glassBackground} !important;
            }
            [data-testid^="aham_calendar.day_"] {
              transition: opacity 0.2s;
            }
          `}</style>
        )}
        <Calendar
          testID="aham_calendar"
          key={currentMonth + mode}
          current={currentMonth}
          maxDate={today}
          hideExtraDays={true}
          onMonthChange={(month: any) => setCurrentMonth(month.dateString)}
          renderHeader={renderCustomHeader}
          style={styles.calendar}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: theme.textSecondary,
            selectedDayBackgroundColor: "transparent", // Stop applying background to base
            selectedDayTextColor: theme.accent, // Fix: Text should be accent colored, not background colored!
            todayTextColor: theme.today,
            dayTextColor: theme.text,
            textDisabledColor: theme.textSecondary,
            dotColor: theme.accent,
            selectedDotColor: theme.accent, // Dot is always outside the green circle now
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
            weekVerticalMargin: 12, // Lowered slightly since base dynamically wraps both text and dot now

            // Force these to ensure react-native-calendars doesn't default to #2d4150
            stylesheet: {
              day: {
                basic: {
                  base: {
                    width: 56,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor: 'transparent'
                  },
                  text: {
                    width: 56,
                    height: 56,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    lineHeight: Platform.OS === 'ios' ? 56 : undefined,
                    fontSize: 20,
                    fontFamily: "CalendarFont-Medium",
                    fontWeight: '500',
                    color: theme.text,
                    backgroundColor: 'transparent',
                    borderRadius: 28,
                    overflow: 'hidden',
                    marginTop: 0
                  },
                  selected: {
                    backgroundColor: 'transparent',
                    borderRadius: 0
                  },
                  today: {
                    backgroundColor: 'transparent',
                    borderRadius: 0
                  },
                  selectedText: {
                    color: theme.accent,
                    backgroundColor: 'transparent'
                  },
                  todayText: {
                    color: theme.textSecondary,
                    backgroundColor: 'transparent'
                  },
                  disabledText: {
                    color: theme.textSecondary
                  },
                  dot: {
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    opacity: 0,
                    marginTop: 8 // Native flex margin below the 56x56 text circle
                  },
                  visibleDot: {
                    opacity: 1,
                    backgroundColor: theme.accent
                  },
                  selectedDot: {
                    backgroundColor: theme.accent
                  }
                }
              }
            }
          }}
          markedDates={{
            ...markedDates,
            [today]: {
              ...markedDates[today],
              selected: true,
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
