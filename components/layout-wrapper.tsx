import { BottomNavigation } from "@/components/bottom-navigation";
import FixedHeader from "@/components/fixed-header";
import { usePathname } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

interface LayoutWrapperProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showBottomNavigation?: boolean;
}

export default function LayoutWrapper({
  children,
  title,
  showBackButton = false,
  showBottomNavigation = true,
}: LayoutWrapperProps) {
  const pathname = usePathname();

  // Don't show header and bottom navigation on payment screen
  const isPaymentScreen = pathname === "/payment";

  // Don't show bottom navigation on auth screens
  const isAuthScreen = pathname.startsWith("/auth");

  // Don't show bottom navigation on menu screens (they have their own)
  const isMenuScreen = pathname.startsWith("/menu");

  const shouldShowHeader = !isPaymentScreen;
  const shouldShowBottomNav =
    showBottomNavigation && !isPaymentScreen && !isAuthScreen && !isMenuScreen;

  return (
    <View style={styles.container}>
      {shouldShowHeader && (
        <FixedHeader title={title} showBackButton={showBackButton} />
      )}
      <View
        style={[
          styles.content,
          shouldShowHeader && styles.contentWithHeader,
          shouldShowBottomNav && styles.contentWithBottomNav,
        ]}
      >
        {children}
      </View>
      {shouldShowBottomNav && <BottomNavigation activeTab="home" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  contentWithHeader: {
    paddingTop: 0, // Header is fixed, so no extra padding needed
  },
  contentWithBottomNav: {
    paddingBottom: 0, // Bottom nav is fixed, so no extra padding needed
  },
});
