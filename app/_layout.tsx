import { AuthProvider } from "@/hooks/useAuth";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="menu" options={{ headerShown: false }} />
        <Stack.Screen name="[...unmatched]" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
