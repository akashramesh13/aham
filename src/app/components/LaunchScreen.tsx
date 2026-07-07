import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

export default function LaunchScreen({ onFinish }: { onFinish: () => void }) {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../../assets/lottie/aham.json")}
        autoPlay
        loop={false}
        style={styles.animation}
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
    width: "100%", // Or use absolute dimensions like width: 300, height: 300
    height: "100%",
  },
});
