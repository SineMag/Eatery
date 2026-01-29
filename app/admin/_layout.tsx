import { Stack } from "expo-router";
import LayoutWrapper from "@/components/layout-wrapper";

export default function AdminLayout() {
  return (
    <LayoutWrapper>
      <Stack>
        <Stack.Screen
          name="dashboard"
          options={{
            headerShown: false,
            title: "Admin Dashboard",
          }}
        />
      </Stack>
    </LayoutWrapper>
  );
}
