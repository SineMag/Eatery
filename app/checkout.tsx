import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks";
import { useCart } from "@/hooks";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
  const [selectedCard, setSelectedCard] = useState("card1");
  const [loading, setLoading] = useState(false);

  const mockCards = [
    { id: "card1", last4: "4242", brand: "Visa" },
    { id: "card2", last4: "5555", brand: "Mastercard" },
  ];

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert("Error", "Please enter a delivery address");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setLoading(true);
    try {
      const subtotal = getTotal();
      const deliveryFee = 2.99;
      const tax = subtotal * 0.1;
      const total = subtotal + deliveryFee + tax;

      // Create order in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.uid,
            total: total,
            status: "pending",
            delivery_address: deliveryAddress,
            payment_method: selectedCard,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      if (orderData) {
        const orderItems = items.map((item) => ({
          order_id: orderData.id,
          food_item_id: item.foodItem.id,
          quantity: item.quantity,
          subtotal: item.foodItem.price * item.quantity,
          selected_sides: item.selectedSides || null,
          selected_drinks: item.selectedDrinks || null,
          selected_extras: item.selectedExtras || null,
          selected_ingredients: item.selectedIngredients || null,
          customizations: item.customizations || null,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      Alert.alert(
        "Order Placed!",
        "Your order has been successfully placed. You will receive a confirmation shortly.",
        [
          {
            text: "Track Order",
            onPress: () => {
              clearCart();
              router.replace("/(tabs)/orders");
            },
          },
          {
            text: "Continue Shopping",
            onPress: () => {
              clearCart();
              router.replace("/(tabs)");
            },
          },
        ],
      );
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#11181C" />
          </TouchableOpacity>
          <Text style={styles.title}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyState}>
          <IconSymbol name="cart" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.shopButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {items.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.foodItem.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              R{(item.foodItem.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TextInput
          style={styles.addressInput}
          placeholder="Enter delivery address"
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
          multiline
        />
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {mockCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.cardOption,
              selectedCard === card.id && styles.cardSelected,
            ]}
            onPress={() => setSelectedCard(card.id)}
          >
            <View style={styles.cardInfo}>
              <IconSymbol name="creditcard" size={20} color="#11181C" />
              <Text style={styles.cardText}>
                {card.brand} •••• {card.last4}
              </Text>
            </View>
            <View
              style={[
                styles.radioButton,
                selectedCard === card.id && styles.radioSelected,
              ]}
            />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addCardButton}>
          <IconSymbol name="plus" size={20} color="#11181C" />
          <Text style={styles.addCardText}>Add New Card</Text>
        </TouchableOpacity>
      </View>

      {/* Total */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>R{getTotal().toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Delivery Fee:</Text>
          <Text style={styles.totalValue}>R2.99</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax:</Text>
          <Text style={styles.totalValue}>
            R{(getTotal() * 0.1).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.totalRow, styles.finalTotal]}>
          <Text style={styles.finalTotalLabel}>Total:</Text>
          <Text style={styles.finalTotalValue}>
            R{(getTotal() + 2.99 + getTotal() * 0.1).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderButtonText}>
            {loading ? "Placing Order..." : "Place Order"}
          </Text>
        </TouchableOpacity>
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
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: "#11181C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#11181C",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#6b7280",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    minHeight: 80,
  },
  cardOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    marginBottom: 8,
  },
  cardSelected: {
    backgroundColor: "#f3f4f6",
    borderColor: "#11181C",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    color: "#11181C",
    marginLeft: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
  radioSelected: {
    backgroundColor: "#11181C",
    borderColor: "#11181C",
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    borderStyle: "dashed",
  },
  addCardText: {
    fontSize: 16,
    color: "#11181C",
    marginLeft: 8,
  },
  totalSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#11181C",
  },
  finalTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#11181C",
  },
  footer: {
    padding: 16,
  },
  placeOrderButton: {
    backgroundColor: "#11181C",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  placeOrderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
