import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCart } from "@/hooks/useCart";
import { CartItem, FoodItem, Option } from "@/types";
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

const mockFoodItems: Record<string, FoodItem> = {
  "1": {
    id: "1",
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and our special sauce",
    price: 12.99,
    imageUrl:
      "https://images.unsplash.com/photo-1568901349414-d2e21657d599?w=300",
    categoryId: "6",
    sides: [
      { id: "s1", name: "Chips", price: 0 },
      { id: "s2", name: "Salad", price: 0 },
      { id: "s3", name: "Pap", price: 0 },
    ],
    drinks: [
      { id: "d1", name: "Coke", price: 2.5 },
      { id: "d2", name: "Fanta", price: 2.5 },
      { id: "d3", name: "Water", price: 1.5 },
    ],
    extras: [
      { id: "e1", name: "Extra Cheese", price: 1.5 },
      { id: "e2", name: "Bacon", price: 2 },
      { id: "e3", name: "Avocado", price: 2.5 },
    ],
    optionalIngredients: [
      { id: "i1", name: "Lettuce", price: 0 },
      { id: "i2", name: "Tomato", price: 0 },
      { id: "i3", name: "Onions", price: 0 },
    ],
  },
};

export default function ItemDetailScreen() {
  const router = useRouter();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSide, setSelectedSide] = useState<Option | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<Option | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<Option[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  const foodItem = mockFoodItems[itemId];

  if (!foodItem) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  const toggleExtra = (extra: Option) => {
    setSelectedExtras((prev) => {
      const isSelected = prev.some((e) => e.id === extra.id);
      if (isSelected) {
        return prev.filter((e) => e.id !== extra.id);
      }
      return [...prev, extra];
    });
  };

  const toggleIngredient = (ingredientName: string) => {
    setRemovedIngredients((prev) => {
      const isRemoved = prev.includes(ingredientName);
      if (isRemoved) {
        return prev.filter((name) => name !== ingredientName);
      }
      return [...prev, ingredientName];
    });
  };

  const calculateTotal = () => {
    let total = foodItem.price * quantity;
    total += (selectedDrink?.price || 0) * quantity;
    total +=
      selectedExtras.reduce((sum, extra) => sum + (extra.price || 0), 0) *
      quantity;
    return total;
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${foodItem.id}-${Date.now()}`,
      foodItem,
      quantity,
      selectedSides: selectedSide ? [selectedSide] : undefined,
      selectedDrinks: selectedDrink ? [selectedDrink] : undefined,
      selectedExtras: selectedExtras.length > 0 ? selectedExtras : undefined,
      customizations: {
        removeIngredients: removedIngredients,
        addIngredients: [],
      },
    };

    addItem(cartItem);
    Alert.alert("Success", "Item added to cart!", [
      { text: "Continue Shopping", onPress: () => router.back() },
      { text: "View Cart", onPress: () => router.push("/(tabs)/cart") },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.title}>{foodItem.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <Image source={{ uri: foodItem.imageUrl }} style={styles.itemImage} />

      <View style={styles.content}>
        <Text style={styles.description}>{foodItem.description}</Text>
        <Text style={styles.basePrice}>
          Base Price: R{foodItem.price.toFixed(2)}
        </Text>

        {/* Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <IconSymbol name="minus" size={20} color="#11181C" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <IconSymbol name="plus" size={20} color="#11181C" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sides */}
        {foodItem.sides && foodItem.sides.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose a Side</Text>
            {foodItem.sides.map((side) => (
              <TouchableOpacity
                key={side.id}
                style={[
                  styles.optionButton,
                  selectedSide?.id === side.id && styles.optionSelected,
                ]}
                onPress={() => setSelectedSide(side)}
              >
                <Text style={styles.optionText}>{side.name}</Text>
                {side.price && (
                  <Text style={styles.optionPrice}>
                    +R{side.price.toFixed(2)}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Drinks */}
        {foodItem.drinks && foodItem.drinks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add a Drink</Text>
            {foodItem.drinks.map((drink) => (
              <TouchableOpacity
                key={drink.id}
                style={[
                  styles.optionButton,
                  selectedDrink?.id === drink.id && styles.optionSelected,
                ]}
                onPress={() => setSelectedDrink(drink)}
              >
                <Text style={styles.optionText}>{drink.name}</Text>
                {drink.price && (
                  <Text style={styles.optionPrice}>
                    +R{drink.price.toFixed(2)}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Extras */}
        {foodItem.extras && foodItem.extras.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Extras</Text>
            {foodItem.extras.map((extra) => (
              <TouchableOpacity
                key={extra.id}
                style={[
                  styles.optionButton,
                  selectedExtras.some((e) => e.id === extra.id) &&
                    styles.optionSelected,
                ]}
                onPress={() => toggleExtra(extra)}
              >
                <Text style={styles.optionText}>{extra.name}</Text>
                {extra.price && (
                  <Text style={styles.optionPrice}>
                    +R{extra.price.toFixed(2)}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Optional Ingredients */}
        {foodItem.optionalIngredients &&
          foodItem.optionalIngredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Remove Ingredients</Text>
              {foodItem.optionalIngredients.map((ingredient) => (
                <TouchableOpacity
                  key={ingredient.id}
                  style={[
                    styles.optionButton,
                    removedIngredients.includes(ingredient.name) &&
                      styles.optionSelected,
                  ]}
                  onPress={() => toggleIngredient(ingredient.name)}
                >
                  <Text style={styles.optionText}>{ingredient.name}</Text>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

        {/* Total and Add to Cart */}
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>
              R{calculateTotal().toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
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
  itemImage: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  basePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#11181C",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 12,
  },
  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: "#f3f4f6",
    borderColor: "#11181C",
  },
  optionText: {
    fontSize: 16,
    color: "#11181C",
  },
  optionPrice: {
    fontSize: 14,
    color: "#6b7280",
  },
  removeText: {
    fontSize: 14,
    color: "#ef4444",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    marginHorizontal: 24,
  },
  footer: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#11181C",
  },
  addButton: {
    backgroundColor: "#11181C",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginTop: 32,
  },
});
