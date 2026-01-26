import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FixedHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backgroundColor?: string;
}

export default function FixedHeader({
  title,
  showBackButton = false,
  backgroundColor = "#fff",
}: FixedHeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { getItemCount } = useCart();
  const cartItemCount = getItemCount();

  const handleProfilePress = () => {
    if (user) {
      router.push("/(tabs)/profile");
    } else {
      router.push("/auth/login");
    }
  };

  const handleCartPress = () => {
    router.push("/(tabs)/cart");
  };

  const handleHomePress = () => {
    router.push("/");
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.leftSection}>
        {showBackButton ? (
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#11181C" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleHomePress}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/Eatery Logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton} onPress={handleCartPress}>
          <IconSymbol name="bag.fill" size={24} color="#11181C" />
          {cartItemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleProfilePress}
        >
          {user?.profileImage ? (
            <Image
              source={{ uri: user.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <IconSymbol
              name="person.crop.circle.fill"
              size={24}
              color="#11181C"
            />
          )}
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    backgroundColor: "#fff",
    zIndex: 100,
  },
  leftSection: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 2,
    alignItems: "center",
  },
  rightSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 120,
    height: 32,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#11181C",
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
  },
  iconButton: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
