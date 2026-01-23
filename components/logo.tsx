import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface LogoProps {
  size?: "small" | "medium" | "large";
  opacity?: number;
}

export function Logo({ size = "medium", opacity = 1 }: LogoProps) {
  const getSize = () => {
    switch (size) {
      case "small":
        return 24;
      case "medium":
        return 32;
      case "large":
        return 48;
      default:
        return 32;
    }
  };

  return (
    <View style={[styles.container, { opacity }]}>
      <Image
        source={require("../assets/images/Eatery Logo.png")}
        style={[styles.logo, { width: getSize(), height: getSize() }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
  },
});
