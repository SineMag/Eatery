import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/useAuth";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const mockOrderDetails = {
  "1": {
    id: "1",
    status: "delivered" as const,
    total: 25.98,
    deliveryAddress: "123 Main St, City, State 12345",
    paymentMethod: "Visa •••• 4242",
    createdAt: new Date("2024-01-20T12:30:00"),
    updatedAt: new Date("2024-01-20T13:45:00"),
    items: [
      {
        name: "Classic Burger",
        quantity: 2,
        price: 12.99,
        customizations: {
          sides: ["Chips"],
          drinks: ["Coke"],
          extras: ["Extra Cheese"],
        },
      },
      {
        name: "Coke",
        quantity: 2,
        price: 2.5,
        customizations: {},
      },
    ],
  },
  "2": {
    id: "2",
    status: "confirmed" as const,
    total: 18.48,
    deliveryAddress: "456 Oak Ave, City, State 67890",
    paymentMethod: "Mastercard •••• 5555",
    createdAt: new Date("2024-01-21T19:15:00"),
    updatedAt: new Date("2024-01-21T19:20:00"),
    items: [
      {
        name: "Caesar Salad",
        quantity: 1,
        price: 8.99,
        customizations: {},
      },
      {
        name: "Chocolate Cake",
        quantity: 1,
        price: 6.99,
        customizations: {},
      },
      {
        name: "Water",
        quantity: 1,
        price: 1.5,
        customizations: {},
      },
    ],
  },
};

export default function OrderDetailScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { user } = useAuth();

  const order = mockOrderDetails[orderId];

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="hand.point.up.left" size={24} color="#11181C" />
          </TouchableOpacity>
          <Text style={styles.title}>Order Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.notLoggedIn}>
          <IconSymbol name="hand.thumbsup.fill" size={48} color="#9ca3af" />
          <Text style={styles.notLoggedInText}>
            Please login to view order details
          </Text>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="hand.point.up.left" size={24} color="#11181C" />
          </TouchableOpacity>
          <Text style={styles.title}>Order Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.notFound}>
          <IconSymbol
            name="exclamationmark.triangle"
            size={48}
            color="#ef4444"
          />
          <Text style={styles.notFoundText}>Order not found</Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "preparing":
        return "#f59e0b";
      case "ready":
        return "#10b981";
      case "delivered":
        return "#6b7280";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Order Confirmed";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready for Pickup";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="hand.point.right" size={20} color="#9ca3af" />
        </TouchableOpacity>
        <Text style={styles.title}>Order #{order.id}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Order Status */}
      <View style={styles.section}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(order.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
        <Text style={styles.orderDate}>
          Placed on {order.createdAt.toLocaleDateString()} at{" "}
          {order.createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemPrice}>R{item.price.toFixed(2)}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              R{(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.itemsTotal}>
          <Text style={styles.itemsTotalLabel}>Items Total:</Text>
          <Text style={styles.itemsTotalValue}>
            R
            {order.items
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Delivery Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Information</Text>
        <View style={styles.infoRow}>
          <IconSymbol name="location" size={20} color="#6b7280" />
          <Text style={styles.infoText}>{order.deliveryAddress}</Text>
        </View>
      </View>

      {/* Payment Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.infoRow}>
          <IconSymbol name="creditcard" size={20} color="#6b7280" />
          <Text style={styles.infoText}>{order.paymentMethod}</Text>
        </View>
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>
            R{(order.total - 2.99 - order.total * 0.1).toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee:</Text>
          <Text style={styles.summaryValue}>R2.99</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax:</Text>
          <Text style={styles.summaryValue}>
            R{(order.total * 0.1).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>R{order.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {order.status === "delivered" && (
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="star" size={20} color="#11181C" />
            <Text style={styles.actionButtonText}>Rate Order</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="phone" size={20} color="#11181C" />
          <Text style={styles.actionButtonText}>Contact Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)")}
        >
          <IconSymbol name="hand.thumbsup.fill" size={20} color="#11181C" />
          <Text style={styles.actionButtonText}>Order Again</Text>
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
  notLoggedIn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  notLoggedInText: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 16,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  notFoundText: {
    fontSize: 16,
    color: "#ef4444",
    marginTop: 16,
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
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  orderDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  itemsTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    marginTop: 8,
  },
  itemsTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  itemsTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#11181C",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#11181C",
    marginLeft: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#11181C",
  },
  totalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#11181C",
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#11181C",
    marginLeft: 8,
  },
});
