import { HoursOfSleepCardProps } from "@/types/hoursOfSleep";
import { Theme } from "@/types/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import useTheme from "../hooks/useTheme";
import GlassCard from "./GlassCard";

const HoursOfSleepCard = ({ value, onChange }: HoursOfSleepCardProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");

    if (cleaned === "") {
      onChange(null);
      return;
    }

    const num = parseInt(cleaned, 10);

    if (num >= 0 && num <= 24) {
      onChange(num);
    }
  };

  const adjust = (delta: number) => {
    const current = value ?? 0;
    const next = Math.max(0, Math.min(24, current + delta));
    if (next !== current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChange(next);
  };

  return (
    <GlassCard>
      <Text style={styles.title}>Hours of Sleep</Text>

      <View style={styles.content}>
        <Pressable onPress={() => adjust(-1)} style={styles.button}>
          <Ionicons name="remove" size={18} color={theme.accent} />
        </Pressable>

        <View style={styles.center}>
          <TextInput
            style={[
              styles.input,
              Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null,
            ]}
            keyboardType="numeric"
            value={value == null ? "" : String(value)}
            onChangeText={handleChange}
            placeholder="8"
            placeholderTextColor={theme.textSecondary}
            selectionColor={theme.accent}
            maxLength={2}
            underlineColorAndroid="transparent"
          />

          <Text style={styles.unit}>hours</Text>
        </View>

        <Pressable onPress={() => adjust(1)} style={styles.button}>
          <Ionicons name="add" size={18} color={theme.accent} />
        </Pressable>
      </View>
    </GlassCard>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    title: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 1,
      textAlign: "center",
      marginBottom: 20,
    },

    content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    center: {
      alignItems: "center",
      flex: 1,
    },

    input: {
      color: theme.text,
      fontSize: 36,
      fontWeight: "800",
      textAlign: "center",
      minWidth: 48,
      padding: 0,
    },

    unit: {
      marginTop: 4,
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: "500",
    },

    button: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.accent + "18",
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default HoursOfSleepCard;
