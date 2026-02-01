import { useAuth } from "@/hooks";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function AuthLayout() {
  const { loading } = useAuth();

  if (loading) {
    return <View />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
