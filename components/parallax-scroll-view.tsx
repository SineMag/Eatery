import React from "react";
import {
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
  ViewProps,
} from "react-native";

export type ParallaxScrollViewProps = ViewProps & {
  headerBackgroundColor?: {
    light: string;
    dark: string;
  };
  headerImage?: React.ReactNode;
  children?: React.ReactNode;
};

export function ParallaxScrollView({
  headerBackgroundColor = { light: "#A1CEDC", dark: "#1D3D47" },
  headerImage,
  children,
  style,
  ...rest
}: ParallaxScrollViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = headerBackgroundColor[colorScheme ?? "light"];

  return (
    <ScrollView style={[styles.container, style]} {...rest}>
      <View style={[styles.header, { backgroundColor }]}>{headerImage}</View>
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
