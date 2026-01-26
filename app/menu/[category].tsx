import { IconSymbol } from "@/components/ui/icon-symbol";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react"; // Added useEffect
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../hooks/useCart";
import { getFoodItemsByCategory } from "../../utils/firestore"; // Import getFoodItemsByCategory
import { FoodItem } from "@/types"; // Import FoodItem interface

export default function MenuScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]); // Renamed from selectedItems to foodItems, and changed type
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState<string | null>(null); // Added error state
  const { addItem, getItemCount } = useCart();

  // Get category from route params
  const categoryId = (params?.category as string)?.toLowerCase() || "mains"; // Changed to categoryId and forced lowercase

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching food items for categoryId:", categoryId);
        const fetchedItems = await getFoodItemsByCategory(categoryId);
        setFoodItems(fetchedItems);
        console.log("Fetched items:", fetchedItems);
      } catch (err: any) {
        console.error("Failed to fetch food items:", err);
        setError("Failed to load menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryId]); // Re-fetch when categoryId changes

  const addToCart = (item: FoodItem) => { // Changed type from MenuItem to FoodItem
    const cartItem = {
      id: item.id,
      foodItem: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl, // Changed from item.image to item.imageUrl
        categoryId: item.categoryId, // Used item.categoryId
        restaurant: item.restaurant,
        distance: item.distance,
        deliveryTime: item.deliveryTime,
      },
      quantity: 1,
    };

    addItem(cartItem);
    Alert.alert("Added to Cart", `${item.name} has been added to your cart!`);
  };

  const getCategoryTitle = () => {
    switch (categoryId) { // Changed to categoryId
      case "mains":
        return "Main Courses";
      case "starters":
        return "Starters";
      case "desserts":
        return "Desserts";
      case "beverages":
        return "Beverages";
      case "burgers":
        return "Burgers";
      case "alcohol":
        return "Alcoholic Beverages";
      default:
        return "Menu";
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading menu items...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (foodItems.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>No items found for this category.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.title}>{getCategoryTitle()}</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
          <View style={styles.cartIcon}>
            <IconSymbol name="bag.fill" size={24} color="#11181C" />
            {getItemCount() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getItemCount()}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuGrid}>
          {foodItems.map((item) => ( // Changed from displayItems to foodItems
            <View key={item.id} style={styles.menuItem}>
              <Image
                source={{ uri: item.imageUrl }} // Changed to use uri for network image
                style={styles.itemImage}
                resizeMode="cover"
                onError={(e) => console.log("Image failed to load:", item.imageUrl, e.nativeEvent.error)}
                onLoad={() => console.log("Image loaded successfully:", item.name)}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.restaurantName}>{item.restaurant}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.locationInfo}>
                  <IconSymbol name="location" size={14} color="#6b7280" />
                  <Text style={styles.distance}>{item.distance}</Text>
                  <Text style={styles.deliveryTime}>
                    {" "}
                    • {item.deliveryTime}
                  </Text>
                </View>
                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>R{item.price}</Text>
                  <TouchableOpacity
                    style={styles.addToCartButtonSmall}
                    onPress={() => addToCart(item)}
                  >
                    <IconSymbol name="plus" size={16} color="#fff" />
                    <Text style={styles.addToCartTextSmall}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContent: { // Added for loading/error states
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuGrid: {
    flexDirection: "column",
    gap: 16,
  },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: "#10b981",
  },
  itemImage: {
    width: "100%",
    height: 200,
  },
  itemInfo: {
    padding: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10b981",
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    lineHeight: 20,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  distance: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  deliveryTime: {
    fontSize: 12,
    color: "#10b981",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#11181C",
  },
  selectedBadge: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: 4,
  },
  footer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    padding: 16,
    paddingBottom: 32,
  },
  footerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectedCount: {
    fontSize: 14,
    color: "#6b7280",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#11181C",
  },
  addToCartButton: {
    backgroundColor: "#11181C",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  addToCartButtonSmall: {
    backgroundColor: "#11181C",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addToCartTextSmall: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cartIcon: {
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});
