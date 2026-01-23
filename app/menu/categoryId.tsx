import { IconSymbol } from "@/components/ui/icon-symbol";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const mockFoodItems = [
  {
    id: "1",
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and our special sauce",
    price: 12.99,
    imageUrl:
      "https://images.unsplash.com/photo-1568901349414-d2e21657d599?w=300",
    categoryId: "6",
  },
  {
    id: "2",
    name: "Caesar Salad",
    description:
      "Fresh romaine lettuce, parmesan, croutons, and caesar dressing",
    price: 8.99,
    imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300",
    categoryId: "2",
  },
  {
    id: "3",
    name: "Chocolate Cake",
    description: "Rich chocolate cake with layers of dark chocolate ganache",
    price: 6.99,
    imageUrl:
      "https://images.unsplash.com/photo-1578988847410-009e06f035a9?w=300",
    categoryId: "3",
  },
];

export default function MenuCategoryScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  const foodItems = mockFoodItems.filter(
    (item) => item.categoryId === categoryId,
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="hand.point.up.left" size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.title}>Menu Items</Text>
        <View style={{ width: 24 }} />
      </View>

      {foodItems.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="hand.thumbsup.fill" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>No items available</Text>
        </View>
      ) : (
        <View style={styles.itemsContainer}>
          {foodItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              onPress={() => router.push(`/item/${item.id}`)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
              </View>
              <IconSymbol name="hand.point.right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#11181C",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 16,
  },
  itemsContainer: {
    padding: 16,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#11181C",
  },
});
