import { BottomNavigation } from "@/components/bottom-navigation";
import { Logo } from "@/components/logo";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { UserAvatar } from "@/components/user-avatar";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { SFSymbol } from "expo-symbols";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const categories: { id: string; name: string; icon: SFSymbol }[] = [
    { id: "1", name: "Mains", icon: "hand.point.up.left.fill" },
    { id: "2", name: "Starters", icon: "hand.thumbsup.fill" },
    { id: "3", name: "Desserts", icon: "hand.point.right.fill" },
    { id: "4", name: "Beverages", icon: "hand.wave.fill" },
    { id: "5", name: "Alcohol", icon: "hand.raised.fill" },
    { id: "6", name: "Burgers", icon: "hand.point.up.left" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              router.push(user ? "/(tabs)/profile" : "/auth/login")
            }
          >
            <UserAvatar size="medium" />
          </TouchableOpacity>
          <Logo size="large" />
          <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
            <IconSymbol
              name="hand.point.up.left.fill"
              size={24}
              color={Colors.light.text}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => router.push(`/menu/${category.id}`)}
            >
              <IconSymbol
                name={category.icon}
                size={32}
                color={Colors.light.text}
              />
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNavigation activeTab="home" />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#11181C",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#11181C",
    margin: 16,
    marginBottom: 8,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  categoryCard: {
    width: "45%",
    aspectRatio: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    margin: "2.5%",
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#11181C",
    marginTop: 8,
  },
});
