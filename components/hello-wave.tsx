import React from "react";
import {
  Animated,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
} from "react-native";

export function HelloWave() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const waveAnimation = Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    const animationLoop = Animated.loop(waveAnimation);
    animationLoop.start();

    return () => animationLoop.stop();
  }, [animatedValue]);

  const waveStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  return <Animated.Text style={[styles.greeting, waveStyle]}>👋</Animated.Text>;
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
