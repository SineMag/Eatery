import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Logo } from "./logo";

interface HeaderProps {
  showBackButton?: boolean;
  showCartButton?: boolean;
  showProfileButton?: boolean;
  title?: string;
  onBackPress?: () => void;
}

export function Header({
  showBackButton = false,
  showCartButton = true,
  showProfileButton = true,
  title,
  onBackPress,
}: HeaderProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleCartPress = () => {
    router.push("/(tabs)/cart");
  };

  const handleProfilePress = () => {
    if (user) {
      router.push("/(tabs)/profile");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity style={styles.iconButton} onPress={handleBackPress}>
            <IconSymbol name="chevron.left" size={24} color="#11181C" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        <Logo size="small" />
      </View>

      <View style={styles.rightSection}>
        {showCartButton && (
          <TouchableOpacity style={styles.iconButton} onPress={handleCartPress}>
            <IconSymbol name="bag.fill" size={24} color="#11181C" />
          </TouchableOpacity>
        )}
        {showProfileButton && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleProfilePress}
          >
            <IconSymbol name="person.crop.circle" size={24} color="#11181C" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    minHeight: 60,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  centerSection: {
    flex: 2,
    alignItems: "center",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
  },
});
