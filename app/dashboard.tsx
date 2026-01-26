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
  items: string[];
}

interface FavoriteRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
}

interface Location {
  id: string;
  name: string;
  address: string;
  isDefault: boolean;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRestaurant[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  // Mock data - in a real app, this would come from Firestore
  useEffect(() => {
    // Mock orders
    setOrders([
      {
        id: "ORD-12345678",
        date: "2024-01-25",
        total: 285,
        status: "completed",
        items: ["Grilled Chicken", "Caesar Salad", "Chocolate Cake"],
      },
      {
        id: "ORD-12345677",
        date: "2024-01-24",
        total: 156,
        status: "completed",
        items: ["Beef Steak", "Fresh Orange Juice"],
      },
      {
        id: "ORD-12345676",
        date: "2024-01-23",
        total: 98,
        status: "pending",
        items: ["Classic Burger", "Lemonade"],
      },
    ]);

    // Mock favorite restaurants
    setFavorites([
      {
        id: "1",
        name: "The Grill House",
        cuisine: "Steakhouse",
        rating: 4.5,
      },
      {
        id: "2",
        name: "Pasta Paradise",
        cuisine: "Italian",
        rating: 4.2,
      },
      {
        id: "3",
        name: "Sushi Master",
        cuisine: "Japanese",
        rating: 4.8,
      },
    ]);

    // Mock delivery locations
    setLocations([
      {
        id: "1",
        name: "Home",
        address: "123 Main Street, Cape Town, 8001",
        isDefault: true,
      },
      {
        id: "2",
        name: "Office",
        address: "456 Business Ave, Cape Town, 8002",
        isDefault: false,
      },
    ]);
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.email?.split("@")[0] || "User"}!
        </Text>
        <Text style={styles.subtitleText}>
          What would you like to order today?
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/")}
        >
          <IconSymbol name="house.fill" size={24} color="#fff" />
          <Text style={styles.actionText}>Order Food</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/cart")}
        >
          <IconSymbol name="bag.fill" size={24} color="#fff" />
          <Text style={styles.actionText}>View Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/settings")}
        >
          <IconSymbol name="person.fill" size={24} color="#fff" />
          <Text style={styles.actionText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => router.push("/orders" as any)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="bag" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              Place your first order to get started
            </Text>
          </View>
        ) : (
          orders.slice(0, 3).map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text
                  style={[
                    styles.orderStatus,
                    { color: getStatusColor(order.status) },
                  ]}
                >
                  {getStatusText(order.status)}
                </Text>
              </View>
              <Text style={styles.orderDate}>{order.date}</Text>
              <Text style={styles.orderItems}>{order.items.join(", ")}</Text>
              <Text style={styles.orderTotal}>R{order.total}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Favorite Restaurants */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favorite Restaurants</Text>
          <TouchableOpacity onPress={() => router.push("/favorites" as any)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="heart" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No favorites yet</Text>
            <Text style={styles.emptySubtext}>
              Add restaurants to your favorites
            </Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {favorites.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                style={styles.restaurantCard}
              >
                <View style={styles.restaurantImage}>
                  <IconSymbol name="fork.knife" size={32} color="#fff" />
                </View>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantCuisine}>
                  {restaurant.cuisine}
                </Text>
                <View style={styles.rating}>
                  <IconSymbol name="star.fill" size={12} color="#fbbf24" />
                  <Text style={styles.ratingText}>{restaurant.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Delivery Locations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Delivery Locations</Text>
          <TouchableOpacity onPress={() => router.push("/locations" as any)}>
            <Text style={styles.seeAllText}>Manage</Text>
          </TouchableOpacity>
        </View>
        {locations.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="location" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No locations saved</Text>
            <Text style={styles.emptySubtext}>Add your delivery addresses</Text>
          </View>
        ) : (
          locations.map((location) => (
            <TouchableOpacity key={location.id} style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <Text style={styles.locationName}>{location.name}</Text>
                {location.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.locationAddress}>{location.address}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: "#6b7280",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#11181C",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 80,
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#fff",
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
  },
  seeAllText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#11181C",
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
  orderDate: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  restaurantCard: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    width: 140,
  },
  restaurantImage: {
    width: "100%",
    height: 80,
    backgroundColor: "#11181C",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 2,
  },
  restaurantCuisine: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  locationCard: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#11181C",
  },
  defaultBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
  },
  locationAddress: {
    fontSize: 12,
    color: "#6b7280",
  },
});
