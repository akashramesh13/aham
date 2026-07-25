import { usePathname, useRouter } from "expo-router";
import { Dimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const TAB_ROUTES = ["/", "/calendar", "/settings"] as const;
const SWIPE_THRESHOLD = Dimensions.get("window").width * 0.2;

export default function useTabSwipe() {
  const router = useRouter();
  const pathname = usePathname();
  const translateX = useSharedValue(0);

  const currentIndex = Math.max(
    0,
    TAB_ROUTES.findIndex((r) => r === pathname)
  );

  const navigateTo = (index: number) => {
    const routes = ["/(tabs)", "/(tabs)/calendar", "/(tabs)/settings"] as const;
    router.replace(routes[index]);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-25, 25])
    .failOffsetY([-15, 15])
    .onUpdate((e) => {
      // Clamp so you can't swipe past edges
      if (
        (currentIndex === 0 && e.translationX > 0) ||
        (currentIndex === TAB_ROUTES.length - 1 && e.translationX < 0)
      ) {
        translateX.value = e.translationX * 0.1; // rubber band
      } else {
        translateX.value = e.translationX * 0.3;
      }
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD && currentIndex > 0) {
        runOnJS(navigateTo)(currentIndex - 1);
      } else if (
        e.translationX < -SWIPE_THRESHOLD &&
        currentIndex < TAB_ROUTES.length - 1
      ) {
        runOnJS(navigateTo)(currentIndex + 1);
      }
      translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { panGesture, animatedStyle };
}
