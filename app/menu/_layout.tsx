import { BottomNavigation } from "@/components/bottom-navigation";
import { Stack } from "expo-router";
import React from "react";

export default function MenuLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="[categoryId]" options={{ headerShown: false }} />
      </Stack>
      <BottomNavigation activeTab="menu" />
    </>
  );
}
