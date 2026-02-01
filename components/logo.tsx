import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface LogoProps {
  size?: "small" | "medium" | "large";
  opacity?: number;
  color?: string;
}

export function Logo({
  size = "medium",
  opacity = 1,
  color = Colors.light.text,
}: LogoProps) {
  const [imageError, setImageError] = useState(false);

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

  const getFontSize = () => {
    switch (size) {
      case "small":
        return 20;
      case "medium":
        return 28;
      case "large":
        return 36;
      default:
        return 28;
    }
  };

  const getLetterSize = () => {
    switch (size) {
      case "small":
        return 16;
      case "medium":
        return 24;
      case "large":
        return 32;
      default:
        return 24;
    }
  };

  // Try to load the image, fallback to text logo if it fails
  const logoSource = require("../assets/images/Eatery Logo.png");

  return (
    <View style={[styles.container, { opacity }]}>
      {imageError ? (
        <Text style={[styles.textLogo, { fontSize: getFontSize(), color }]}>
          <Text style={[styles.letterE, { fontSize: getLetterSize(), color }]}>
            E
          </Text>
          <Text style={[styles.letterA, { fontSize: getLetterSize(), color }]}>
            a
          </Text>
          <Text style={[styles.letterT, { fontSize: getLetterSize(), color }]}>
            t
          </Text>
          <Text style={[styles.letterE2, { fontSize: getLetterSize(), color }]}>
            e
          </Text>
          <Text style={[styles.letterR, { fontSize: getLetterSize(), color }]}>
            r
          </Text>
          <Text style={[styles.letterY, { fontSize: getLetterSize(), color }]}>
            y
          </Text>
        </Text>
      ) : (
        <Image
          source={logoSource}
          style={[styles.imageLogo, { width: getSize(), height: getSize() }]}
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  textLogo: {
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
  },
  imageLogo: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  letterE: {
    fontWeight: "900",
  },
  letterA: {
    fontWeight: "300",
  },
  letterT: {
    fontWeight: "300",
  },
  letterE2: {
    fontWeight: "900",
  },
  letterR: {
    fontWeight: "300",
  },
  letterY: {
    fontWeight: "900",
  },
});
