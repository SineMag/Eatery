import { IconSymbol } from "@/components/ui/icon-symbol";
import { supabase } from "@/utils/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrderDetailScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            id,
            total,
            status,
            delivery_address,
            payment_method,
            created_at,
            updated_at,
            order_items (
              id,
              quantity,
              subtotal,
              selected_sides,
              selected_drinks,
              selected_extras,
              food_items (
                id,
                name,
                price,
                description
              )
            )
          `
          )
          .eq("id", orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
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
      case "pending":
        return "Pending";
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

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#11181C" />
          </TouchableOpacity>
          <Text style={styles.title}>Order Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading order details...</Text>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#11181C" />
          </TouchableOpacity>
          <Text style={styles.title}>Order Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={{ color: "#ef4444" }}>Order not found</Text>
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
        <Text style={styles.title}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Order Status */}
      <View style={styles.section}>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
          </View>
          <Text style={styles.orderId}>Order #{order.id.slice(0, 8)}</Text>
        </View>
        <Text style={styles.orderDate}>
          {new Date(order.created_at).toLocaleDateString()} at{" "}
          {new Date(order.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.order_items?.map((item: any, index: number) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.food_items?.name}</Text>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              {item.selected_sides && item.selected_sides.length > 0 && (
                <Text style={styles.customization}>
                  Sides: {item.selected_sides.map((s: any) => s.name).join(", ")}
                </Text>
              )}
              {item.selected_drinks && item.selected_drinks.length > 0 && (
                <Text style={styles.customization}>
                  Drinks: {item.selected_drinks.map((d: any) => d.name).join(", ")}
                </Text>
              )}
              {item.selected_extras && item.selected_extras.length > 0 && (
                <Text style={styles.customization}>
                  Extras: {item.selected_extras.map((e: any) => e.name).join(", ")}
                </Text>
              )}
            </View>
            <Text style={styles.itemPrice}>R{item.subtotal.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.addressBox}>
          <IconSymbol name="location.fill" size={20} color="#11181C" />
          <Text style={styles.addressText}>{order.delivery_address}</Text>
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentBox}>
          <IconSymbol name="creditcard" size={20} color="#11181C" />
          <Text style={styles.paymentText}>{order.payment_method}</Text>
        </View>
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>
            R{(order.total * 0.9).toFixed(2)}
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

      {/* Action Buttons */}
      {order.status !== "delivered" && order.status !== "cancelled" && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.trackButton}>
            <IconSymbol name="location.fill" size={16} color="#fff" />
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === "delivered" && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.rateButton}>
            <IconSymbol name="star.fill" size={16} color="#fff" />
            <Text style={styles.rateButtonText}>Rate Order</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
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
    marginBottom: 12,
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  orderId: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
  },
  orderDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#11181C",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  customization: {
    fontSize: 11,
    color: "#9ca3af",
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  addressBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    gap: 12,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: "#11181C",
    lineHeight: 20,
  },
  paymentBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    gap: 12,
  },
  paymentText: {
    fontSize: 14,
    color: "#11181C",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#11181C",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#11181C",
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  trackButton: {
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  trackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  rateButton: {
    flexDirection: "row",
    backgroundColor: "#f59e0b",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  rateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
