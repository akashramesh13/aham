import React, { useState, useEffect } from "react";
import { Modal, View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import { Theme } from "@/types/theme";
import GlassCard from "./GlassCard";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface MonthYearPickerProps {
  visible: boolean;
  onClose: () => void;
  currentDate: string; // YYYY-MM-DD
  onSelect: (date: string) => void;
}

export default function MonthYearPicker({ visible, onClose, currentDate, onSelect }: MonthYearPickerProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const initialYear = parseInt(currentDate.split("-")[0], 10);
  const initialMonth = parseInt(currentDate.split("-")[1], 10) - 1;

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  useEffect(() => {
    if (visible) {
      setSelectedYear(parseInt(currentDate.split("-")[0], 10));
      setSelectedMonth(parseInt(currentDate.split("-")[1], 10) - 1);
    }
  }, [visible, currentDate]);

  const todayDate = new Date();
  const currentRealYear = todayDate.getFullYear();
  const currentRealMonth = todayDate.getMonth();

  const years = Array.from({ length: 21 }, (_, i) => currentRealYear - 20 + i);

  const handleApply = () => {
    // Prevent selecting future months in current year
    if (selectedYear === currentRealYear && selectedMonth > currentRealMonth) {
      setSelectedMonth(currentRealMonth);
    }
    const mm = String(selectedMonth + 1).padStart(2, "0");
    onSelect(`${selectedYear}-${mm}-01`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <GlassCard style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Select Month & Year</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </Pressable>
            </View>
            
            <View style={styles.pickersContainer}>
              {/* Month Picker */}
              <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollColumn}>
                {MONTHS.map((m, i) => {
                  const isActive = i === selectedMonth;
                  const isDisabled = selectedYear === currentRealYear && i > currentRealMonth;
                  return (
                    <Pressable
                      key={m}
                      style={[styles.item, isActive && styles.itemActive]}
                      onPress={() => !isDisabled && setSelectedMonth(i)}
                    >
                      <Text style={[styles.itemText, isActive && styles.itemTextActive, isDisabled && { opacity: 0.2 }]}>{m}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.divider} />

              {/* Year Picker */}
              <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollColumn}>
                {years.map((y) => {
                  const isActive = y === selectedYear;
                  return (
                    <Pressable
                      key={y}
                      style={[styles.item, isActive && styles.itemActive]}
                      onPress={() => setSelectedYear(y)}
                    >
                      <Text style={[styles.itemText, isActive && styles.itemTextActive]}>{y}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <Pressable style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </Pressable>
          </GlassCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    modalContent: {
      width: 320,
      maxHeight: 500,
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 24,
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },
    closeButton: {
      padding: 4,
    },
    pickersContainer: {
      flexDirection: "row",
      height: 300,
      width: "100%",
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.border,
      paddingVertical: 16,
    },
    scrollColumn: {
      flex: 1,
    },
    divider: {
      width: 1,
      backgroundColor: theme.border,
      marginHorizontal: 8,
    },
    item: {
      paddingVertical: 12,
      alignItems: "center",
      borderRadius: 12,
    },
    itemActive: {
      backgroundColor: theme.accent + "44",
    },
    itemText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text,
      opacity: 0.7,
    },
    itemTextActive: {
      color: theme.accent,
      opacity: 1,
      fontWeight: "700",
    },
    applyButton: {
      marginTop: 24,
      width: "100%",
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    applyButtonText: {
      color: theme.background,
      fontSize: 16,
      fontWeight: "700",
    },
  });
