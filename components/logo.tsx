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
        return 40;
      case "medium":
        return 64;
      case "large":
        return 80;
      default:
        return 64;
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
    maxWidth: 120,
    maxHeight: 120,
  },
  logo: {
    width: 64,
    height: 64,
    maxWidth: "100%",
    maxHeight: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
