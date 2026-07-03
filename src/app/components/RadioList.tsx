import { Props } from "@/types/radioList";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useTheme from "../hooks/useTheme";

export default function RadioList<T extends string>({
  value,
  onChange,
  options,
}: Props<T>) {
  const { theme } = useTheme();

  return (
    <View>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={styles.row}
          >
            <View
              style={[
                styles.outer,
                {
                  borderColor: theme.text,
                },
              ]}
            >
              {selected && (
                <View
                  style={[
                    styles.inner,
                    {
                      backgroundColor: theme.text,
                    },
                  ]}
                />
              )}
            </View>

            <Text
              style={{
                color: theme.text,
                fontFamily: styles.text.fontFamily,
                fontSize: 18,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  outer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  text: {
    fontFamily: "monospace",
  },
});
