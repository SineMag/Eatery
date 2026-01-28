import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

interface BottomNavProps {
  activeTab?: string;
}

export function BottomNavigation({ activeTab }: BottomNavProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const navItems = [
    {
      id: "home",
      icon: "house.fill" as const,
      label: "Home",
      route: "/",
    },
    {
      id: "menu",
      icon: "hand.point.up.left.fill" as const,
      label: "Menu",
      route: "/menu/1",
    },
    {
      id: "cart",
      icon: "hand.point.up.left" as const,
      label: "Cart",
      route: "/(tabs)/cart",
      badge: itemCount > 0 ? itemCount.toString() : undefined,
    },
    {
      id: "orders",
      icon: "list.bullet.rectangle" as const,
      label: "Orders",
      route: "/(tabs)/orders",
    },
    {
      id: "profile",
      icon: "person.crop.circle.fill" as const,
      label: "Profile",
      route: user ? "/(tabs)/profile" : "/auth/login",
    },
    {
      id: "settings",
      icon: "gearshape.fill" as const,
      label: "Settings",
      route: user ? "/(tabs)/settings" : "/auth/login",
    },
  ];

  const handlePress = (item: (typeof navItems)[0]) => {
    if (item.id === "home") {
      // Use replace for home to avoid stacking navigation history
      router.replace(item.route as any);
    } else {
      router.push(item.route as any);
    }
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.navItem, activeTab === item.id && styles.activeItem]}
          onPress={() => handlePress(item)}
        >
          <View style={styles.iconContainer}>
            <IconSymbol
              name={item.icon}
              size={24}
              color={activeTab === item.id ? "#11181C" : "#9ca3af"}
            />
            {item.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            )}
          </View>
          <Text
            style={[styles.label, activeTab === item.id && styles.activeLabel]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingBottom: 4,
    paddingTop: 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  activeItem: {
    // No additional styling needed, handled by icon and label colors
  },
  iconContainer: {
    position: "relative",
    marginBottom: 1,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  label: {
    fontSize: 9,
    color: "#9ca3af",
  },
  activeLabel: {
    color: "#11181C",
    fontWeight: "600",
  },
});
