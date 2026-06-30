import { Theme } from "@/types/theme";
import { StyleSheet, Text, View } from "react-native";
import useTheme from "../hooks/useTheme";
import HamburgerMenu from "./HamburgerMenu";

type AppHeaderProps = {
  title: string;
  showMenu?: boolean;
};

const AppHeader = ({ title, showMenu = false }: AppHeaderProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <>
      <View style={styles.header}>
        <View style={styles.side}>{showMenu && <HamburgerMenu />}</View>
        <Text style={styles.title}>{title ?? "अहम्"}</Text>
        <View style={styles.side} />
      </View>
      <View style={styles.lineStyle} />
    </>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    title: {
      color: theme.text,
      fontFamily: "TitleFont-Bold",
      fontSize: 40,
      textTransform: "uppercase",
    },
    lineStyle: {
      alignSelf: "stretch",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.text,
      marginTop: 10,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 16,
    },
    side: {
      width: 32,
      alignItems: "center",
    },
  });

export default AppHeader;
