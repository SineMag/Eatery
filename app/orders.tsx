import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "completed" | "pending" | "cancelled";
  items: { name: string; quantity: number; price: number }[];
  deliveryAddress: string;
  paymentMethod: string;
}

export default function OrdersScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in a real app, this would come from Firestore
    const mockOrders: Order[] = [
      {
        id: "ORD-12345678",
        date: "2024-01-25",
        total: 285,
        status: "completed",
        items: [
          { name: "Grilled Chicken Breast", quantity: 1, price: 120 },
          { name: "Caesar Salad", quantity: 1, price: 65 },
          { name: "Chocolate Cake", quantity: 1, price: 45 },
          { name: "Fresh Orange Juice", quantity: 1, price: 25 },
          { name: "Delivery Fee", quantity: 1, price: 30 },
        ],
        deliveryAddress: "123 Main Street, Cape Town, 8001",
        paymentMethod: "Credit Card",
      },
      {
        id: "ORD-12345677",
        date: "2024-01-24",
        total: 156,
        status: "completed",
        items: [
          { name: "Beef Steak", quantity: 1, price: 180 },
          { name: "Fresh Orange Juice", quantity: 1, price: 25 },
          { name: "Delivery Fee", quantity: 1, price: 30 },
        ],
        deliveryAddress: "123 Main Street, Cape Town, 8001",
        paymentMethod: "Credit Card",
      },
      {
        id: "ORD-12345676",
        date: "2024-01-23",
        total: 98,
        status: "pending",
        items: [
          { name: "Classic Burger", quantity: 1, price: 85 },
          { name: "Lemonade", quantity: 1, price: 20 },
          { name: "Delivery Fee", quantity: 1, price: 30 },
        ],
        deliveryAddress: "456 Business Ave, Cape Town, 8002",
        paymentMethod: "Cash on Delivery",
      },
      {
        id: "ORD-12345675",
        date: "2024-01-22",
        total: 142,
        status: "cancelled",
        items: [
          { name: "Grilled Salmon", quantity: 1, price: 150 },
          { name: "Iced Coffee", quantity: 1, price: 28 },
          { name: "Delivery Fee", quantity: 1, price: 30 },
        ],
        deliveryAddress: "123 Main Street, Cape Town, 8001",
        paymentMethod: "Credit Card",
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Delivered";
      case "pending":
        return "On the way";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "checkmark.circle.fill";
      case "pending":
        return "clock.fill";
      case "cancelled":
        return "xmark.circle.fill";
      default:
        return "questionmark.circle.fill";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 24 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="bag" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            Place your first order to see it here
          </Text>
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.orderButtonText}>Order Food</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.ordersList}>
          {orders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={styles.statusContainer}>
                  <IconSymbol
                    name={getStatusIcon(order.status)}
                    size={16}
                    color={getStatusColor(order.status)}
                  />
                  <Text
                    style={[
                      styles.orderStatus,
                      { color: getStatusColor(order.status) },
                    ]}
                  >
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.orderItems}>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemName}>
                      {item.quantity}x {item.name}
                    </Text>
                    <Text style={styles.itemPrice}>R{item.price}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                  <IconSymbol name="location" size={14} color="#6b7280" />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {order.deliveryAddress}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <IconSymbol name="creditcard" size={14} color="#6b7280" />
                  <Text style={styles.detailText}>{order.paymentMethod}</Text>
                </View>
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.orderTotal}>R{order.total}</Text>
              </View>
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
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#11181C",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#11181C",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  orderButton: {
    backgroundColor: "#11181C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  orderItems: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: "#6b7280",
  },
  orderDetails: {
    marginBottom: 12,
    gap: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: "#6b7280",
    flex: 1,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  totalLabel: {
    fontSize: 16,
    color: "#6b7280",
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#11181C",
  },
});
