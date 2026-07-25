import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import useTabSwipe from "../hooks/useTabSwipe";

interface SwipeableScreenProps {
  children: ReactNode;
}

export default function SwipeableScreen({ children }: SwipeableScreenProps) {
  const { panGesture, animatedStyle } = useTabSwipe();

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
