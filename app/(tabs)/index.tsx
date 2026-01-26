import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import React from "react";

export default function TabsIndex() {
  const { user } = useAuth();

  // Redirect all users to home screen
  return <Redirect href="/" />;
}
