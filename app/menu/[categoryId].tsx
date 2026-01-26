import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
  const { addItem, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const [itemQuantities, setItemQuantities] = useState<{
    [key: string]: number;
  }>({});

  const foodItems = mockFoodItems.filter(
    (item) => item.categoryId === categoryId,
  );

  const handleAddToCart = (item: any) => {
    if (!user) {
      Alert.alert("Login Required", "Please login to add items to cart", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.push("/auth/login") },
      ]);
      return;
    }

    const cartItem = {
      id: item.id,
      foodItem: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        categoryId: item.categoryId,
      },
      quantity: 1,
      selectedSides: [],
      selectedDrinks: [],
      selectedExtras: [],
      selectedIngredients: [],
      customizations: {
        removeIngredients: [],
        addIngredients: [],
      },
    };

    addItem(cartItem);

    // Show visual feedback
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 2000);

    // Update local quantity state
    setItemQuantities((prev) => ({ ...prev, [item.id]: 1 }));

    Alert.alert("Added to Cart", `${item.name} has been added to your cart!`);
  };

  const handleQuantityChange = (item: any, change: number) => {
    if (!user) {
      Alert.alert("Login Required", "Please login to modify cart", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.push("/auth/login") },
      ]);
      return;
    }

    const currentQuantity = itemQuantities[item.id] || 0;
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      // Remove item from cart
      removeItem(item.id);
      setItemQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[item.id];
        return newQuantities;
      });
    } else if (newQuantity === 1) {
      // Add item to cart if not already there
      if (currentQuantity === 0) {
        handleAddToCart(item);
      } else {
        updateQuantity(item.id, newQuantity);
        setItemQuantities((prev) => ({ ...prev, [item.id]: newQuantity }));
      }
    } else {
      // Update quantity
      updateQuantity(item.id, newQuantity);
      setItemQuantities((prev) => ({ ...prev, [item.id]: newQuantity }));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="hand.point.up.left" size={24} color="#11181C" />
          </TouchableOpacity>
          <Text style={styles.title}>Menu Items</Text>
          {user ? (
            <View style={{ width: 24 }} />
          ) : (
            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push("/auth/login")}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!user && (
          <View style={styles.authPrompt}>
            <IconSymbol name="person.crop.circle" size={32} color="#9ca3af" />
            <Text style={styles.authPromptText}>
              Login to add items to your cart and place orders
            </Text>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push("/auth/register")}
            >
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        )}

        {foodItems.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="hand.thumbsup.fill" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No items available</Text>
          </View>
        ) : (
          <View style={styles.itemsContainer}>
            {foodItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <TouchableOpacity
                  style={styles.itemContent}
                  onPress={() => router.push(`/item/${item.id}`)}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </View>
                  <IconSymbol
                    name="hand.point.right"
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
                <View style={styles.itemActions}>
                  <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
                  {user ? (
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={[
                          styles.quantityButton,
                          styles.quantityButtonMinus,
                          (itemQuantities[item.id] || 0) === 0 &&
                            styles.disabledQuantityButton,
                        ]}
                        onPress={() => handleQuantityChange(item, -1)}
                        disabled={(itemQuantities[item.id] || 0) === 0}
                      >
                        <IconSymbol
                          name="minus"
                          size={16}
                          color={
                            (itemQuantities[item.id] || 0) === 0
                              ? "#d1d5db"
                              : "#11181C"
                          }
                        />
                      </TouchableOpacity>
                      <View style={styles.quantityDisplay}>
                        <Text style={styles.quantityText}>
                          {itemQuantities[item.id] || 0}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item, 1)}
                      >
                        <IconSymbol name="plus" size={16} color="#11181C" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.loginButton}
                      onPress={() => router.push("/auth/login")}
                    >
                      <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  itemContent: {
    flexDirection: "row",
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
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    padding: 2,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  quantityButtonMinus: {
    marginRight: 2,
  },
  disabledQuantityButton: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e5e5",
  },
  quantityDisplay: {
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#11181C",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#11181C",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  authButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#11181C",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  authPrompt: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9fafb",
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  authPromptText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
  },
  registerButton: {
    backgroundColor: "#11181C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  disabledButtonText: {
    color: "#9ca3af",
  },
  successButton: {
    backgroundColor: "#10b981",
  },
});
