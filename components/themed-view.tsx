import { Colors } from "@/constants/theme";
import React from "react";
import { useColorScheme, View, ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor =
    lightColor ?? darkColor ?? Colors[colorScheme ?? "light"].background;

  const viewStyle = [{ backgroundColor }, style] as ViewProps["style"];

  return <View style={viewStyle} {...rest} />;
}
