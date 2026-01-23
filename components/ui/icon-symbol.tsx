import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import React from "react";

export type IconSymbolName = SymbolViewProps["name"];

export interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color?: string;
  weight?: SymbolWeight;
}

export function IconSymbol({
  name,
  size = 24,
  color,
  weight = "regular",
}: IconSymbolProps) {
  return (
    <SymbolView
      name={name}
      size={size}
      weight={weight}
      tintColor={color}
      style={{ width: size, height: size }}
    />
  );
}
