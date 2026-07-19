import * as SplashScreen from "expo-splash-screen";
import LottieView from "lottie-react-native";
import { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function LaunchScreen({ onFinish }: { onFinish: () => void }) {
  const animationRef = useRef<any>(null);
  const isWeb = Platform.OS === "web";
  const [isAnimationLayoutReady, setIsAnimationLayoutReady] = useState(isWeb);

  const handleAnimationLayout = () => {
    if (isWeb) {
      SplashScreen.hideAsync();
      return;
    }

    // Capture the layout setup offscreen
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsAnimationLayoutReady(true);

        // Explicitly force the animation engine to stick on frame 0
        // so it cannot progress or skip ahead while hidden
        animationRef.current?.pause();

        // Hide the splash screen now
        SplashScreen.hideAsync();

        // Wait 350ms for the native Android/iOS splash screen fade-out animation
        // to completely finish before starting frame 1 of our Lottie animation
        setTimeout(() => {
          animationRef.current?.play();
        }, 350);
      }, 50);
    });
  };

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require("../../../assets/lottie/aham.json")}
        autoPlay={isWeb} // Web doesn't have native splash screen fade lag
        loop={false}
        style={[styles.animation, { opacity: isAnimationLayoutReady ? 1 : 0 }]}
        renderMode="HARDWARE"
        onLayout={handleAnimationLayout}
        onAnimationFinish={() => {
          setTimeout(() => {
            onFinish();
          }, 250);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  animation: {
    width: "100%",
    height: "100%",
  },
});
