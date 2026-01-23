import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
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

  const categories = [
    { id: "1", name: "Mains", icon: "fork.knife" },
    { id: "2", name: "Starters", icon: "leaf" },
    { id: "3", name: "Desserts", icon: "birthday.cake" },
    { id: "4", name: "Beverages", icon: "cup.and.saucer" },
    { id: "5", name: "Alcohol", icon: "wineglass" },
    { id: "6", name: "Burgers", icon: "b.circle" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eatery</Text>
        {user ? (
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
            <IconSymbol
              name="person.fill"
              size={24}
              color={Colors.light.text}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <IconSymbol name="person" size={24} color={Colors.light.text} />
          </TouchableOpacity>
        )}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
