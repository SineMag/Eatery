import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { useOrders } from '@/src/contexts/OrderContext';
import { foodItems, categories } from '@/src/data/menuData';
import { Order } from '@/src/types';
import { 
  BackIcon, 
  ChartIcon, 
  OrdersIcon, 
  MenuIcon,
  DollarIcon,
  TrendingUpIcon,
  PackageIcon,
  UsersIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  SettingsIcon
} from '@/src/components/Icons';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#d97706' },
  confirmed: { bg: '#dbeafe', text: '#2563eb' },
  preparing: { bg: '#fce7f3', text: '#db2777' },
  ready: { bg: '#d1fae5', text: '#059669' },
  delivered: { bg: '#e5e7eb', text: '#374151' },
  cancelled: { bg: '#fee2e2', text: '#dc2626' },
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(17, 24, 28, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  decimalPlaces: 0,
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'items' | 'settings'>('overview');
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'Eatery Restaurant',
    address: '123 Food Street, Johannesburg',
    phone: '+27 11 123 4567',
    email: 'info@eatery.co.za',
    openingHours: '09:00 - 22:00',
  });

  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  const chartWidth = Math.min(width - 64, isDesktop ? 600 : isTablet ? 500 : 400);

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

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyRevenue = last7Days.map(date => {
      const dayOrders = orders.filter(o => 
        o.createdAt.split('T')[0] === date && o.status !== 'cancelled'
      );
      return dayOrders.reduce((sum, o) => sum + o.total, 0);
    });

    return { 
      totalRevenue, 
      todayOrders: todayOrders.length, 
      totalOrders: orders.length, 
      statusCounts, 
      topItems,
      dailyRevenue,
      last7Days,
      avgOrderValue: orders.length > 0 ? totalRevenue / orders.filter(o => o.status !== 'cancelled').length : 0
    };
  }, [orders]);

  const pieData = Object.entries(stats.statusCounts).map(([status, count], index) => ({
    name: status,
    count,
    color: ['#d97706', '#2563eb', '#db2777', '#059669', '#374151', '#dc2626'][index] || '#6b7280',
    legendFontColor: '#374151',
    legendFontSize: 12,
  }));

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

  const handleSaveRestaurantInfo = () => {
    Alert.alert('Success', 'Restaurant information updated successfully!');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartIcon },
    { id: 'orders', label: 'Orders', icon: OrdersIcon },
    { id: 'items', label: 'Menu', icon: MenuIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, isDesktop && styles.headerDesktop]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <BackIcon size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={[styles.title, isDesktop && styles.titleDesktop]}>Admin Dashboard</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.tabs, isDesktop && styles.tabsDesktop]}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab, 
                activeTab === tab.id && styles.tabActive,
                isDesktop && styles.tabDesktop
              ]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <IconComponent size={18} color={activeTab === tab.id ? '#fff' : '#6b7280'} />
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {activeTab === 'overview' && (
          <View style={isDesktop && styles.overviewDesktop}>
            <View style={[styles.statsGrid, isDesktop && styles.statsGridDesktop]}>
              <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }, isDesktop && styles.statCardDesktop]}>
                <View style={styles.statHeader}>
                  <DollarIcon size={24} color="#10b981" />
                </View>
                <Text style={[styles.statValue, isDesktop && styles.statValueDesktop]}>
                  R{stats.totalRevenue.toFixed(0)}
                </Text>
                <Text style={styles.statLabel}>Total Revenue</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#eff6ff' }, isDesktop && styles.statCardDesktop]}>
                <View style={styles.statHeader}>
                  <PackageIcon size={24} color="#3b82f6" />
                </View>
                <Text style={[styles.statValue, isDesktop && styles.statValueDesktop]}>{stats.totalOrders}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#fef3c7' }, isDesktop && styles.statCardDesktop]}>
                <View style={styles.statHeader}>
                  <TrendingUpIcon size={24} color="#d97706" />
                </View>
                <Text style={[styles.statValue, isDesktop && styles.statValueDesktop]}>{stats.todayOrders}</Text>
                <Text style={styles.statLabel}>Today's Orders</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#fce7f3' }, isDesktop && styles.statCardDesktop]}>
                <View style={styles.statHeader}>
                  <UsersIcon size={24} color="#db2777" />
                </View>
                <Text style={[styles.statValue, isDesktop && styles.statValueDesktop]}>
                  R{stats.avgOrderValue.toFixed(0)}
                </Text>
                <Text style={styles.statLabel}>Avg. Order Value</Text>
              </View>
            </View>

            <View style={[styles.chartsRow, isDesktop && styles.chartsRowDesktop]}>
              <View style={[styles.chartSection, isDesktop && styles.chartSectionDesktop]}>
                <Text style={styles.chartTitle}>Revenue (Last 7 Days)</Text>
                <BarChart
                  data={{
                    labels: stats.last7Days.map(d => d.slice(-2)),
                    datasets: [{ data: stats.dailyRevenue.length > 0 ? stats.dailyRevenue : [0] }],
                  }}
                  width={chartWidth}
                  height={200}
                  yAxisLabel="R"
                  yAxisSuffix=""
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                  }}
                  style={styles.chart}
                />
              </View>

              {pieData.length > 0 && (
                <View style={[styles.chartSection, isDesktop && styles.chartSectionDesktop]}>
                  <Text style={styles.chartTitle}>Order Status Distribution</Text>
                  <PieChart
                    data={pieData}
                    width={chartWidth}
                    height={200}
                    chartConfig={chartConfig}
                    accessor="count"
                    backgroundColor="transparent"
                    paddingLeft="15"
                  />
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Selling Items</Text>
              {stats.topItems.map((item, index) => (
                <View key={item.name} style={styles.topItem}>
                  <View style={styles.topItemRank}>
                    <Text style={styles.topItemRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.topItemInfo}>
                    <Text style={styles.topItemName}>{item.name}</Text>
                    <Text style={styles.topItemSales}>{item.quantity} sold</Text>
                  </View>
                  <Text style={styles.topItemRevenue}>R{item.revenue.toFixed(0)}</Text>
                </View>
              ))}
              {stats.topItems.length === 0 && (
                <Text style={styles.emptyText}>No sales data yet</Text>
              )}
            </View>
          </View>
        )}

        {activeTab === 'orders' && (
          <View style={[styles.ordersList, isDesktop && styles.ordersListDesktop]}>
            {orders.length === 0 ? (
              <View style={styles.emptyState}>
                <OrdersIcon size={48} color="#d1d5db" />
                <Text style={styles.emptyTitle}>No orders yet</Text>
                <Text style={styles.emptyText}>Orders will appear here</Text>
              </View>
            ) : (
              <View style={isDesktop && styles.ordersGrid}>
                {orders.map((order) => {
                  const statusColor = statusColors[order.status] || statusColors.pending;
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-ZA', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <View key={order.id} style={[styles.orderCard, isDesktop && styles.orderCardDesktop]}>
                      <View style={styles.orderHeader}>
                        <View>
                          <Text style={styles.orderId}>#{order.id.slice(-6)}</Text>
                          <Text style={styles.orderDate}>{orderDate}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                          <Text style={[styles.statusBadgeText, { color: statusColor.text }]}>
                            {order.status}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.orderCustomer}>
                        {order.userName || 'Unknown'} - {order.userContact || 'N/A'}
                      </Text>
                      <Text style={styles.orderAddress} numberOfLines={1}>{order.deliveryAddress}</Text>
                      
                      <View style={styles.orderItems}>
                        {order.items.slice(0, 2).map((item, idx) => (
                          <Text key={idx} style={styles.orderItemText}>
                            {item.quantity}x {item.foodItem.name}
                          </Text>
                        ))}
                        {order.items.length > 2 && (
                          <Text style={styles.moreItems}>+{order.items.length - 2} more</Text>
                        )}
                      </View>

                      <View style={styles.orderFooter}>
                        <Text style={styles.orderTotal}>R{order.total.toFixed(2)}</Text>
                      </View>
                      
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
                              <Text style={styles.statusButtonText}>Preparing</Text>
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
                })}
              </View>
            )}
          </View>
        )}

        {activeTab === 'items' && (
          <View style={styles.itemsList}>
            <TouchableOpacity 
              style={styles.addItemButton}
              onPress={() => Alert.alert('Coming Soon', 'Add new menu item functionality will be available soon!')}
            >
              <PlusIcon size={20} color="#fff" />
              <Text style={styles.addItemButtonText}>Add New Item</Text>
            </TouchableOpacity>

            {categories.map((category) => (
              <View key={category.id} style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  <Text style={styles.categoryCount}>
                    {foodItems.filter(i => i.categoryId === category.id).length} items
                  </Text>
                </View>
                <View style={isDesktop && styles.menuItemsGrid}>
                  {foodItems
                    .filter((item) => item.categoryId === category.id)
                    .map((item) => (
                      <View key={item.id} style={[styles.menuItem, isDesktop && styles.menuItemDesktop]}>
                        <View style={styles.menuItemInfo}>
                          <Text style={styles.menuItemName}>{item.name}</Text>
                          <Text style={styles.menuItemDesc} numberOfLines={1}>
                            {item.description}
                          </Text>
                        </View>
                        <Text style={styles.menuItemPrice}>R{item.price.toFixed(2)}</Text>
                        <View style={styles.menuItemActions}>
                          <TouchableOpacity style={styles.menuItemAction}>
                            <EditIcon size={16} color="#3b82f6" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.menuItemAction}>
                            <TrashIcon size={16} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'settings' && (
          <View style={[styles.settingsContent, isDesktop && styles.settingsContentDesktop]}>
            <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
              <Text style={styles.sectionTitle}>Restaurant Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Restaurant Name</Text>
                <TextInput
                  style={styles.input}
                  value={restaurantInfo.name}
                  onChangeText={(text) => setRestaurantInfo({...restaurantInfo, name: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={[styles.input, { minHeight: 80 }]}
                  value={restaurantInfo.address}
                  onChangeText={(text) => setRestaurantInfo({...restaurantInfo, address: text})}
                  multiline
                />
              </View>

              <View style={isDesktop ? styles.inputRow : undefined}>
                <View style={[styles.inputGroup, isDesktop && { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={restaurantInfo.phone}
                    onChangeText={(text) => setRestaurantInfo({...restaurantInfo, phone: text})}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={[styles.inputGroup, isDesktop && { flex: 1, marginLeft: 16 }]}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={restaurantInfo.email}
                    onChangeText={(text) => setRestaurantInfo({...restaurantInfo, email: text})}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Opening Hours</Text>
                <TextInput
                  style={styles.input}
                  value={restaurantInfo.openingHours}
                  onChangeText={(text) => setRestaurantInfo({...restaurantInfo, openingHours: text})}
                />
              </View>

              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveRestaurantInfo}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerDesktop: {
    paddingHorizontal: 40,
  },
  headerButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11181C',
  },
  titleDesktop: {
    fontSize: 28,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  tabsDesktop: {
    paddingHorizontal: 40,
    gap: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  tabDesktop: {
    flex: 0,
    paddingHorizontal: 24,
  },
  tabActive: {
    backgroundColor: '#11181C',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  overviewDesktop: {
    paddingHorizontal: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statsGridDesktop: {
    gap: 20,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
  },
  statCardDesktop: {
    width: '23%',
    padding: 24,
  },
  statHeader: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 4,
  },
  statValueDesktop: {
    fontSize: 32,
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  chartsRow: {
    gap: 16,
  },
  chartsRowDesktop: {
    flexDirection: 'row',
    gap: 24,
  },
  chartSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  chartSectionDesktop: {
    flex: 1,
    padding: 24,
    marginBottom: 0,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionDesktop: {
    padding: 32,
    maxWidth: 600,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 16,
  },
  topItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  topItemRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topItemRankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
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
  ordersListDesktop: {
    paddingHorizontal: 24,
  },
  ordersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  orderCardDesktop: {
    width: '48%',
    marginBottom: 0,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  orderDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
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
    marginTop: 2,
  },
  orderItems: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  orderItemText: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  orderFooter: {
    marginTop: 12,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  statusButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  itemsList: {},
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#11181C',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  addItemButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
    flex: 1,
  },
  categoryCount: {
    fontSize: 13,
    color: '#6b7280',
  },
  menuItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  menuItemDesktop: {
    width: '48%',
    marginBottom: 0,
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
    marginRight: 12,
  },
  menuItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  menuItemAction: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  settingsContent: {},
  settingsContentDesktop: {
    paddingHorizontal: 24,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#11181C',
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
