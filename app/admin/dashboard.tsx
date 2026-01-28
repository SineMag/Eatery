import { IconSymbol } from "@/components/ui/icon-symbol";
import { useStaffAuth } from "@/hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data for analytics
const mockAnalytics = {
  totalOrders: 156,
  totalRevenue: 12450.5,
  averageOrderValue: 79.8,
  totalCustomers: 89,
  ordersThisMonth: 45,
  revenueThisMonth: 3560.25,
  topItems: [
    { name: "Classic Burger", orders: 34, revenue: 1122.66 },
    { name: "Grilled Chicken", orders: 28, revenue: 3360 },
    { name: "Caesar Salad", orders: 22, revenue: 1210 },
    { name: "Chocolate Cake", orders: 19, revenue: 1235 },
    { name: "Fresh Juice", orders: 18, revenue: 450 },
  ],
  ordersByStatus: {
    pending: 5,
    confirmed: 8,
    preparing: 3,
    ready: 2,
    delivered: 138,
    cancelled: 4,
  },
  revenueByDay: [
    { day: "Mon", revenue: 450 },
    { day: "Tue", revenue: 520 },
    { day: "Wed", revenue: 480 },
    { day: "Thu", revenue: 610 },
    { day: "Fri", revenue: 890 },
    { day: "Sat", revenue: 1200 },
    { day: "Sun", revenue: 950 },
  ],
};

export default function AdminDashboard() {
  const router = useRouter();
  const { staff, loading, signOut } = useStaffAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "items" | "settings">("overview");

  // Protect admin route - redirect if not admin
  useEffect(() => {
    if (!loading && !staff) {
      Alert.alert(
        "Access Denied",
        "You must be logged in as staff to access the admin dashboard.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/staff/login" as any),
          },
        ]
      );
    }
  }, [staff, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#11181C" />
        <Text style={{ marginTop: 16, color: "#6b7280" }}>
          Checking permissions...
        </Text>
      </View>
    );
  }

  // Don't render admin content if not authorized
  if (!staff) {
    return null;
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          signOut().finally(() => router.replace("/staff/login" as any));
        },
      },
    ]);
  };

  const renderOverview = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <IconSymbol name="bag.fill" size={24} color="#3b82f6" />
          <Text style={styles.metricValue}>{mockAnalytics.totalOrders}</Text>
          <Text style={styles.metricLabel}>Total Orders</Text>
        </View>
        <View style={styles.metricCard}>
          <IconSymbol name="dollarsign.circle.fill" size={24} color="#10b981" />
          <Text style={styles.metricValue}>
            R{mockAnalytics.totalRevenue.toFixed(0)}
          </Text>
          <Text style={styles.metricLabel}>Total Revenue</Text>
        </View>
        <View style={styles.metricCard}>
          <IconSymbol name="person.2.fill" size={24} color="#f59e0b" />
          <Text style={styles.metricValue}>{mockAnalytics.totalCustomers}</Text>
          <Text style={styles.metricLabel}>Customers</Text>
        </View>
        <View style={styles.metricCard}>
          <IconSymbol name="chart.bar.fill" size={24} color="#8b5cf6" />
          <Text style={styles.metricValue}>
            R{mockAnalytics.averageOrderValue.toFixed(2)}
          </Text>
          <Text style={styles.metricLabel}>Avg Order</Text>
        </View>
      </View>

      {/* This Month */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Month</Text>
        <View style={styles.monthStats}>
          <View style={styles.monthStatItem}>
            <Text style={styles.monthStatLabel}>Orders</Text>
            <Text style={styles.monthStatValue}>{mockAnalytics.ordersThisMonth}</Text>
          </View>
          <View style={styles.monthStatItem}>
            <Text style={styles.monthStatLabel}>Revenue</Text>
            <Text style={styles.monthStatValue}>
              R{mockAnalytics.revenueThisMonth.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Revenue by Day Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue by Day</Text>
        <View style={styles.chartContainer}>
          {mockAnalytics.revenueByDay.map((item, index) => {
            const maxRevenue = Math.max(...mockAnalytics.revenueByDay.map((d) => d.revenue));
            const height = (item.revenue / maxRevenue) * 150;
            return (
              <View key={index} style={styles.barContainer}>
                <View
                  style={[styles.bar, { height }]}
                />
                <Text style={styles.barLabel}>{item.day}</Text>
                <Text style={styles.barValue}>R{item.revenue}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Top Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Selling Items</Text>
        {mockAnalytics.topItems.map((item, index) => (
          <View key={index} style={styles.topItemRow}>
            <View style={styles.topItemInfo}>
              <Text style={styles.topItemName}>{item.name}</Text>
              <Text style={styles.topItemOrders}>{item.orders} orders</Text>
            </View>
            <Text style={styles.topItemRevenue}>R{item.revenue.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Order Status Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.statusGrid}>
          {Object.entries(mockAnalytics.ordersByStatus).map(([status, count]) => (
            <View key={status} style={styles.statusCard}>
              <Text style={styles.statusCount}>{count}</Text>
              <Text style={styles.statusLabel}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderOrders = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {[
          { id: 1001, customer: 'John Doe', time: '2 hours ago', total: 89.99, status: 'Delivered', color: '#10b981', notes: 'No onions, please.', payment: 'Card' },
          { id: 1002, customer: 'Jane Smith', time: '1 hour ago', total: 120.00, status: 'Preparing', color: '#f59e0b', notes: '', payment: 'EFT' },
          { id: 1003, customer: 'Peter Parker', time: '30 min ago', total: 55.50, status: 'Pending', color: '#60a5fa', notes: 'Ring bell twice.', payment: 'Cash' },
          { id: 1004, customer: 'Mary Jane', time: '10 min ago', total: 75.00, status: 'Cancelled', color: '#ef4444', notes: 'Changed my mind', payment: 'Card' },
        ].map((o) => (
          <View key={o.id} style={styles.orderRow}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderNumber}>Order #{o.id}</Text>
              <Text style={styles.orderCustomer}>{o.customer}</Text>
              {!!o.notes && <Text style={styles.orderNotes}>Note: {o.notes}</Text>}
              <Text style={styles.orderTime}>{o.time}</Text>
            </View>
            <View style={styles.orderAmount}>
              <Text style={styles.orderPrice}>R{o.total.toFixed(2)}</Text>
              <TouchableOpacity style={[styles.orderStatus, { backgroundColor: o.color }]}>
                <Text style={styles.orderStatusText}>{o.status}</Text>
              </TouchableOpacity>
              <Text style={styles.paymentMethod}>Payment: {o.payment}</Text>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderItems = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.itemsHeader}>
          <Text style={styles.sectionTitle}>Food Items</Text>
          <TouchableOpacity style={styles.addButton}>
            <IconSymbol name="plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {mockAnalytics.topItems.map((item, index) => (
          <View key={index} style={styles.itemCard}>
            <View style={styles.itemCardContent}>
              <Text style={styles.itemCardName}>{item.name}</Text>
              <Text style={styles.itemCardOrders}>{item.orders} sold</Text>
            </View>
            <View style={styles.itemCardActions}>
              <TouchableOpacity style={styles.iconButton}>
                <IconSymbol name="pencil" size={16} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <IconSymbol name="trash" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restaurant Settings</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Restaurant Name</Text>
          <Text style={styles.settingValue}>Eatery Restaurant</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Address</Text>
          <Text style={styles.settingValue}>123 Main Street, City</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Phone</Text>
          <Text style={styles.settingValue}>+1 (555) 123-4567</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Email</Text>
          <Text style={styles.settingValue}>admin@eatery.com</Text>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <IconSymbol name="pencil" size={16} color="#fff" />
          <Text style={styles.editButtonText}>Edit Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <IconSymbol name="arrowshape.turn.up.left" size={16} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="xmark" size={24} color="#11181C" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        {(["overview", "orders", "items", "settings"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "orders" && renderOrders()}
      {activeTab === "items" && renderItems()}
      {activeTab === "settings" && renderSettings()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#11181C",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#11181C",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  tabTextActive: {
    color: "#11181C",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  metricCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#11181C",
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 12,
  },
  monthStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monthStatItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    marginHorizontal: 4,
  },
  monthStatLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  monthStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#11181C",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 200,
    paddingVertical: 16,
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: 30,
    backgroundColor: "#3b82f6",
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  barValue: {
    fontSize: 10,
    color: "#11181C",
    fontWeight: "500",
  },
  topItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  topItemInfo: {
    flex: 1,
  },
  topItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#11181C",
  },
  topItemOrders: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  topItemRevenue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#11181C",
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statusCard: {
    width: "48%",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  statusCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#11181C",
  },
  statusLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#11181C",
  },
  orderCustomer: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  orderTime: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
  orderAmount: {
    alignItems: "flex-end",
  },
  orderNotes: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  paymentMethod: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 6,
  },
  viewButton: {
    marginTop: 6,
    backgroundColor: "#11181C",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#11181C",
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  orderStatusText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
  },
  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#11181C",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    gap: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  itemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  itemCardContent: {
    flex: 1,
  },
  itemCardName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#11181C",
  },
  itemCardOrders: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  itemCardActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
  },
  settingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  settingLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#11181C",
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#fee2e2",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutButtonText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },
});
