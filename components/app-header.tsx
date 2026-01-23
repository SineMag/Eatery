import { Logo } from "@/components/logo";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AppHeaderProps {
  title?: string;
  showCart?: boolean;
  showProfile?: boolean;
  showLogo?: boolean;
  rightAction?: React.ReactNode;
}

export function AppHeader({
  title,
  showCart = true,
  showProfile = true,
  showLogo = true,
  rightAction,
}: AppHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {showProfile && (
          <TouchableOpacity
            onPress={() =>
              router.push(user ? "/(tabs)/profile" : "/auth/login")
            }
          >
            <UserAvatar size="medium" />
          </TouchableOpacity>
        )}
        {title && <View style={styles.titleSpacer} />}
      </View>

      {title && <Text style={styles.title}>{title}</Text>}

      <View style={styles.headerRight}>
        {rightAction || (
          <>
            {showCart && (
              <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
                <IconSymbol
                  name="hand.point.up.left.fill"
                  size={24}
                  color="#11181C"
                />
              </TouchableOpacity>
            )}
            {showLogo && <Logo size="medium" />}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    minHeight: 80,
    backgroundColor: "#fff",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#11181C",
    textAlign: "center",
    flex: 1,
  },
  titleSpacer: {
    width: 48,
  },
});
