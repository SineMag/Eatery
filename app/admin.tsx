import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { useOrders } from '@/src/contexts/OrderContext';
import { foodItems, categories } from '@/src/data/menuData';
import { Order } from '@/src/types';

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#d97706' },
  confirmed: { bg: '#dbeafe', text: '#2563eb' },
  preparing: { bg: '#fce7f3', text: '#db2777' },
  ready: { bg: '#d1fae5', text: '#059669' },
  delivered: { bg: '#e5e7eb', text: '#374151' },
  cancelled: { bg: '#fee2e2', text: '#dc2626' },
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'items'>('overview');

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    
    const todayOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt).toDateString();
      const today = new Date().toDateString();
      return orderDate === today;
    });

    const statusCounts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const itemSales = orders.flatMap((o) =>
      o.items.map((i) => ({ name: i.foodItem.name, quantity: i.quantity, revenue: i.totalPrice }))
    );
    
    const topItems = Object.values(
      itemSales.reduce((acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = { name: item.name, quantity: 0, revenue: 0 };
        }
        acc[item.name].quantity += item.quantity;
        acc[item.name].revenue += item.revenue;
        return acc;
      }, {} as Record<string, { name: string; quantity: number; revenue: number }>)
    ).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    return { totalRevenue, todayOrders: todayOrders.length, totalOrders: orders.length, statusCounts, topItems };
  }, [orders]);

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    Alert.alert(
      'Update Status',
      `Change order status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Update', onPress: () => updateOrderStatus(orderId, newStatus) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Admin Dashboard</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.tabs}>
        {(['overview', 'orders', 'items'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {activeTab === 'overview' && (
          <>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>R{stats.totalRevenue.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Total Revenue</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.totalOrders}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.todayOrders}</Text>
                <Text style={styles.statLabel}>Today's Orders</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{foodItems.length}</Text>
                <Text style={styles.statLabel}>Menu Items</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Status Distribution</Text>
              <View style={styles.statusChart}>
                {Object.entries(stats.statusCounts).map(([status, count]) => {
                  const color = statusColors[status] || statusColors.pending;
                  return (
                    <View key={status} style={styles.statusItem}>
                      <View style={[styles.statusDot, { backgroundColor: color.text }]} />
                      <Text style={styles.statusName}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Text>
                      <Text style={styles.statusCount}>{count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Selling Items</Text>
              {stats.topItems.map((item, index) => (
                <View key={item.name} style={styles.topItem}>
                  <Text style={styles.topItemRank}>{index + 1}</Text>
                  <View style={styles.topItemInfo}>
                    <Text style={styles.topItemName}>{item.name}</Text>
                    <Text style={styles.topItemSales}>{item.quantity} sold</Text>
                  </View>
                  <Text style={styles.topItemRevenue}>R{item.revenue.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'orders' && (
          <View style={styles.ordersList}>
            {orders.length === 0 ? (
              <Text style={styles.emptyText}>No orders yet</Text>
            ) : (
              orders.map((order) => {
                const statusColor = statusColors[order.status] || statusColors.pending;
                return (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderId}>#{order.id.slice(-6)}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                        <Text style={[styles.statusBadgeText, { color: statusColor.text }]}>
                          {order.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.orderCustomer}>
                      {order.userName || 'Unknown'} - {order.userContact || 'N/A'}
                    </Text>
                    <Text style={styles.orderAddress}>{order.deliveryAddress}</Text>
                    <Text style={styles.orderTotal}>R{order.total.toFixed(2)}</Text>
                    
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <View style={styles.statusButtons}>
                        {order.status === 'pending' && (
                          <TouchableOpacity
                            style={[styles.statusButton, { backgroundColor: '#3b82f6' }]}
                            onPress={() => handleStatusUpdate(order.id, 'confirmed')}
                          >
                            <Text style={styles.statusButtonText}>Confirm</Text>
                          </TouchableOpacity>
                        )}
                        {order.status === 'confirmed' && (
                          <TouchableOpacity
                            style={[styles.statusButton, { backgroundColor: '#db2777' }]}
                            onPress={() => handleStatusUpdate(order.id, 'preparing')}
                          >
                            <Text style={styles.statusButtonText}>Start Preparing</Text>
                          </TouchableOpacity>
                        )}
                        {order.status === 'preparing' && (
                          <TouchableOpacity
                            style={[styles.statusButton, { backgroundColor: '#059669' }]}
                            onPress={() => handleStatusUpdate(order.id, 'ready')}
                          >
                            <Text style={styles.statusButtonText}>Ready</Text>
                          </TouchableOpacity>
                        )}
                        {order.status === 'ready' && (
                          <TouchableOpacity
                            style={[styles.statusButton, { backgroundColor: '#374151' }]}
                            onPress={() => handleStatusUpdate(order.id, 'delivered')}
                          >
                            <Text style={styles.statusButtonText}>Delivered</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={[styles.statusButton, { backgroundColor: '#ef4444' }]}
                          onPress={() => handleStatusUpdate(order.id, 'cancelled')}
                        >
                          <Text style={styles.statusButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}

        {activeTab === 'items' && (
          <View style={styles.itemsList}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>
                  {category.icon} {category.name}
                </Text>
                {foodItems
                  .filter((item) => item.categoryId === category.id)
                  .map((item) => (
                    <View key={item.id} style={styles.menuItem}>
                      <View style={styles.menuItemInfo}>
                        <Text style={styles.menuItemName}>{item.name}</Text>
                        <Text style={styles.menuItemDesc} numberOfLines={1}>
                          {item.description}
                        </Text>
                      </View>
                      <Text style={styles.menuItemPrice}>R{item.price.toFixed(2)}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11181C',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#11181C',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 16,
  },
  statusChart: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  statusCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  topItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  topItemRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
    marginRight: 12,
  },
  topItemInfo: {
    flex: 1,
  },
  topItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#11181C',
  },
  topItemSales: {
    fontSize: 12,
    color: '#6b7280',
  },
  topItemRevenue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  ordersList: {
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    paddingVertical: 40,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  orderCustomer: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  orderAddress: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  itemsList: {},
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#11181C',
  },
  menuItemDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#11181C',
  },
});
