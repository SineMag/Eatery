import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  Animated,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { useOrders } from '@/src/contexts/OrderContext';
import { useMenu } from '@/src/contexts/MenuContext';
import { Order, FoodItem } from '@/src/types';
import { useResponsive } from '@/src/hooks/useResponsive';
import { 
  BackIcon, 
  ChartIcon, 
  OrdersIcon, 
  MenuIcon,
  EditIcon,
  TrashIcon,
  SettingsIcon
} from '@/src/components/Icons';
import { PieChart } from 'react-native-chart-kit';

const RESTAURANT_INFO_KEY = '@eatery_restaurant_info';
const defaultRestaurantInfo = {
  name: 'Eatery Restaurant',
  address: '123 Food Street, Johannesburg',
  phone: '+27 11 123 4567',
  email: 'info@eatery.co.za',
  openingHours: '09:00 - 22:00',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#d97706' },
  confirmed: { bg: '#dbeafe', text: '#2563eb' },
  preparing: { bg: '#fce7f3', text: '#db2777' },
  ready: { bg: '#d1fae5', text: '#059669' },
  delivered: { bg: '#e5e7eb', text: '#374151' },
  cancelled: { bg: '#fee2e2', text: '#dc2626' },
  deleted: { bg: '#f3f4f6', text: '#6b7280' },
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
  const { user, createStaffAccount, isLoading, logout } = useAuth();
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const { width, isTablet, isDesktop } = useResponsive();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'items' | 'settings'>('overview');
  const [staffName, setStaffName] = useState('');
  const [staffSurname, setStaffSurname] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [itemFormMode, setItemFormMode] = useState<'create' | 'edit'>('create');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: categories[0]?.id || '',
  });
  const [restaurantInfo, setRestaurantInfo] = useState(defaultRestaurantInfo);

  const chartWidth = Math.min(width - 64, isDesktop ? 600 : isTablet ? 500 : 400);
  const liveDotOpacity = useRef(new Animated.Value(1)).current;
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

    return { 
      totalRevenue, 
      todayOrders: todayOrders.length, 
      totalOrders: orders.length, 
      statusCounts, 
      topItems,
      avgOrderValue: orders.length > 0 ? totalRevenue / orders.filter(o => o.status !== 'cancelled').length : 0
    };
  }, [orders]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(liveDotOpacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(liveDotOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    return () => pulse.stop();
  }, [liveDotOpacity]);

  useEffect(() => {
    const loadRestaurantInfo = async () => {
      try {
        const stored = await AsyncStorage.getItem(RESTAURANT_INFO_KEY);
        if (!stored) return;
        setRestaurantInfo(JSON.parse(stored));
      } catch {
        // Keep defaults when storage is unavailable/corrupt.
      }
    };

    void loadRestaurantInfo();
  }, []);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/auth/staff-entry" />;
  }

  if (!user.isAdmin && !user.isStaff) {
    return <Redirect href="/" />;
  }

  const pieData = Object.entries(stats.statusCounts).map(([status, count], index) => ({
    name: status,
    count,
    color: ['#d97706', '#2563eb', '#db2777', '#059669', '#374151', '#dc2626'][index] || '#6b7280',
    legendFontColor: '#374151',
    legendFontSize: 12,
  }));

  const topItemsPieData = stats.topItems.map((item, index) => ({
    name: item.name,
    value: item.revenue,
    color: ['#11181C', '#2563eb', '#10b981', '#d97706', '#db2777'][index] || '#6b7280',
    legendFontColor: '#374151',
    legendFontSize: 12,
  }));

  const confirmAction = (message: string, onConfirm: () => void) => {
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' ? window.confirm(message) : true;
      if (confirmed) onConfirm();
      return;
    }

    Alert.alert('Please Confirm', message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: onConfirm },
    ]);
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    confirmAction(`Change order status to ${newStatus}?`, () => updateOrderStatus(orderId, newStatus));
  };

  const handleSaveRestaurantInfo = () => {
    const saveRestaurantInfo = async () => {
      try {
        await AsyncStorage.setItem(RESTAURANT_INFO_KEY, JSON.stringify(restaurantInfo));
        Alert.alert('Success', 'Restaurant information updated successfully!');
      } catch {
        Alert.alert('Error', 'Unable to save restaurant information.');
      }
    };

    void saveRestaurantInfo();
  };

  const handleResetRestaurantInfo = () => {
    confirmAction('Restore default restaurant information?', () => {
      const resetInfo = async () => {
        setRestaurantInfo(defaultRestaurantInfo);
        try {
          await AsyncStorage.removeItem(RESTAURANT_INFO_KEY);
          Alert.alert('Reset', 'Defaults restored.');
        } catch {
          Alert.alert('Error', 'Unable to reset restaurant information.');
        }
      };

      void resetInfo();
    });
  };

  const performSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);
      await logout();
      router.dismissAll();
      router.replace('/');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSignOut = () => {
    if (isSigningOut) return;

    if (Platform.OS === 'web') {
      void performSignOut();
      return;
    }

    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => void performSignOut() },
    ]);
  };

  const handleCreateStaffAccount = async () => {
    if (!staffName.trim() || !staffSurname.trim()) {
      Alert.alert('Missing Info', 'Enter staff name and surname');
      return;
    }

    const result = await createStaffAccount(staffName, staffSurname);
    if (!result.success || !result.credentials) {
      Alert.alert('Creation Failed', result.error || 'Could not create staff account');
      return;
    }

    setStaffName('');
    setStaffSurname('');
    Alert.alert(
      'Staff Account Created',
      `Email: ${result.credentials.email}\nStaff ID: ${result.credentials.staffId}\nPassword: ${result.credentials.password}`
    );
  };

  const updateNewItemField = (field: keyof typeof newItem, value: string) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const resetNewItemForm = () => {
    setNewItem({
      name: '',
      description: '',
      price: '',
      image: '',
      categoryId: categories[0]?.id || '',
    });
    setItemFormMode('create');
    setEditingItemId(null);
  };

  const openCreateItemForm = () => {
    resetNewItemForm();
  };

  const openEditItemForm = (item: FoodItem) => {
    setItemFormMode('edit');
    setEditingItemId(item.id);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image,
      categoryId: item.categoryId,
    });
  };

  const handleDeleteItem = (item: FoodItem) => {
    confirmAction(`Remove "${item.name}" from the menu?`, () => {
      const removeItem = async () => {
        await deleteMenuItem(item.id);
        if (editingItemId === item.id) {
          resetNewItemForm();
        }
        Alert.alert('Deleted', 'Menu item removed.');
      };

      void removeItem();
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    confirmAction('Mark this order as deleted?', () => deleteOrder(orderId));
  };

  const handleSaveMenuItem = async () => {
    const parsedPrice = Number(newItem.price);
    if (!newItem.name.trim() || !newItem.description.trim() || !newItem.image.trim() || !newItem.categoryId) {
      Alert.alert('Missing Fields', 'Fill in name, description, image URL, and category.');
      return;
    }

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Invalid Price', 'Enter a valid price greater than 0.');
      return;
    }

    setIsSavingItem(true);
    try {
      if (itemFormMode === 'edit' && editingItemId) {
        await updateMenuItem(editingItemId, {
          name: newItem.name.trim(),
          description: newItem.description.trim(),
          price: parsedPrice,
          image: newItem.image.trim(),
          categoryId: newItem.categoryId,
        });
        Alert.alert('Updated', 'Menu changes are now visible to customers.');
      } else {
        await addMenuItem({
          name: newItem.name.trim(),
          description: newItem.description.trim(),
          price: parsedPrice,
          image: newItem.image.trim(),
          categoryId: newItem.categoryId,
          sides: [],
          drinks: [],
          extras: [],
          ingredients: [],
        });
        Alert.alert('Saved', 'New menu item is now visible to customers.');
      }
      resetNewItemForm();
    } catch {
      Alert.alert('Error', 'Unable to save menu changes.');
    } finally {
      setIsSavingItem(false);
    }
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
        <View style={styles.headerActions}>
          <View style={styles.liveBadge}>
            <Animated.View style={[styles.liveDot, { opacity: liveDotOpacity }]} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <TouchableOpacity
            style={[styles.signOutButton, isSigningOut && styles.signOutButtonDisabled]}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            <Text style={styles.signOutButtonText}>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {activeTab === 'overview' && (
          <View style={isDesktop && styles.overviewDesktop}>
            <View style={[styles.statsGrid, isDesktop && styles.statsGridDesktop]}>
              <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }, isDesktop && styles.statCardDesktop]}>
                <Text style={[styles.statValue, isDesktop && styles.statValueDesktop]}>
                  R{stats.totalRevenue.toFixed(0)}
                </Text>
                <Text style={styles.statLabel}>Total Revenue</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#eff6ff' }, isDesktop && styles.statCardDesktop]}>
                <Text style={[styles.statValue, isDesktop && styles.statValueDesktop]}>{stats.totalOrders}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#fef3c7' }, isDesktop && styles.statCardDesktop]}>
                <Text style={[styles.statValue, isDesktop && styles.statValueDesktop]}>{stats.todayOrders}</Text>
                <Text style={styles.statLabel}>Today's Orders</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#fce7f3' }, isDesktop && styles.statCardDesktop]}>
                <Text style={[styles.statValue, isDesktop && styles.statValueDesktop]}>
                  R{stats.avgOrderValue.toFixed(0)}
                </Text>
                <Text style={styles.statLabel}>Avg. Order Value</Text>
              </View>
            </View>

            <View style={[styles.chartsRow, isDesktop && styles.chartsRowDesktop]}>
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

              {topItemsPieData.length > 0 && (
                <View style={[styles.chartSection, isDesktop && styles.chartSectionDesktop]}>
                  <Text style={styles.chartTitle}>Top Item Revenue Share</Text>
                  <PieChart
                    data={topItemsPieData}
                    width={chartWidth}
                    height={200}
                    chartConfig={chartConfig}
                    accessor="value"
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
            <TouchableOpacity
              style={styles.viewAllOrdersButton}
              onPress={() => router.push('/admin-orders')}
            >
              <Text style={styles.viewAllOrdersButtonText}>View All Orders</Text>
            </TouchableOpacity>

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
                      
                      {order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'deleted' && (
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

                      <TouchableOpacity
                        style={styles.deleteOrderButton}
                        onPress={() => handleDeleteOrder(order.id)}
                      >
                        <TrashIcon size={14} color="#ef4444" />
                        <Text style={styles.deleteOrderButtonText}>Delete Order</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {activeTab === 'items' && (
          <View style={styles.itemsList}>
            <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
              <View style={styles.menuEditorHeader}>
                <Text style={styles.sectionTitle}>
                  {itemFormMode === 'edit' ? 'Edit Menu Item' : 'Add New Menu Item'}
                </Text>
                {itemFormMode === 'edit' && (
                  <TouchableOpacity style={styles.menuEditorCancelButton} onPress={openCreateItemForm}>
                    <Text style={styles.menuEditorCancelText}>Cancel Edit</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={newItem.name}
                  onChangeText={(text) => updateNewItemField('name', text)}
                  placeholder="Item name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={newItem.description}
                  onChangeText={(text) => updateNewItemField('description', text)}
                  placeholder="Item description"
                  multiline
                />
              </View>

              <View style={isDesktop ? styles.inputRow : undefined}>
                <View style={[styles.inputGroup, isDesktop && { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Price (R)</Text>
                  <TextInput
                    style={styles.input}
                    value={newItem.price}
                    onChangeText={(text) => updateNewItemField('price', text)}
                    keyboardType="decimal-pad"
                    placeholder="99.99"
                  />
                </View>
                <View style={[styles.inputGroup, isDesktop && { flex: 1, marginLeft: 16 }]}>
                  <Text style={styles.inputLabel}>Image URL</Text>
                  <TextInput
                    style={styles.input}
                    value={newItem.image}
                    onChangeText={(text) => updateNewItemField('image', text)}
                    placeholder="https://..."
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categorySelector}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryChip,
                        newItem.categoryId === category.id && styles.categoryChipActive,
                      ]}
                      onPress={() => updateNewItemField('categoryId', category.id)}
                    >
                      <Text style={styles.categoryChipEmoji}>{category.icon}</Text>
                      <Text
                        style={[
                          styles.categoryChipText,
                          newItem.categoryId === category.id && styles.categoryChipTextActive,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.saveButton, isSavingItem && styles.signOutButtonDisabled]}
                onPress={handleSaveMenuItem}
                disabled={isSavingItem}
              >
                <Text style={styles.saveButtonText}>
                  {isSavingItem
                    ? 'Saving...'
                    : itemFormMode === 'edit'
                    ? 'Update Item'
                    : 'Add Item'}
                </Text>
              </TouchableOpacity>
            </View>

            {categories.map((category) => (
              <View key={category.id} style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  <Text style={styles.categoryCount}>
                    {menuItems.filter((i) => i.categoryId === category.id).length} items
                  </Text>
                </View>
                <View style={isDesktop && styles.menuItemsGrid}>
                  {menuItems
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
                          <TouchableOpacity
                            style={styles.menuItemAction}
                            onPress={() => openEditItemForm(item)}
                          >
                            <EditIcon size={16} color="#3b82f6" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.menuItemAction}
                            onPress={() => handleDeleteItem(item)}
                          >
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

              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetRestaurantInfo}
              >
                <Text style={styles.resetButtonText}>Reset to Defaults</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.section, isDesktop && styles.sectionDesktop]}>
              <Text style={styles.sectionTitle}>Create Staff Account</Text>

              <View style={isDesktop ? styles.inputRow : undefined}>
                <View style={[styles.inputGroup, isDesktop && { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={staffName}
                    onChangeText={setStaffName}
                    placeholder="John"
                  />
                </View>
                <View style={[styles.inputGroup, isDesktop && { flex: 1, marginLeft: 16 }]}>
                  <Text style={styles.inputLabel}>Surname</Text>
                  <TextInput
                    style={styles.input}
                    value={staffSurname}
                    onChangeText={setStaffSurname}
                    placeholder="Doe"
                  />
                </View>
              </View>

              <Text style={styles.emptyText}>Generated format: name.surname@company.com</Text>

              <TouchableOpacity style={styles.saveButton} onPress={handleCreateStaffAccount}>
                <Text style={styles.saveButtonText}>Generate Staff Credentials</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={[styles.tabsBottom, isDesktop && styles.tabsBottomDesktop]}>
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
      </View>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16a34a',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
    letterSpacing: 0.4,
  },
  signOutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  signOutButtonDisabled: {
    opacity: 0.7,
  },
  signOutButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
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
  tabsBottom: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  tabsBottomDesktop: {
    paddingHorizontal: 24,
  },
  tabsDesktop: {
    paddingHorizontal: 16,
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
  viewAllOrdersButton: {
    backgroundColor: '#11181C',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  viewAllOrdersButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  deleteOrderButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  deleteOrderButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
  itemsList: {},
  menuEditorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  menuEditorCancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
  },
  menuEditorCancelText: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '600',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  categoryChipActive: {
    backgroundColor: '#11181C',
    borderColor: '#11181C',
  },
  categoryChipEmoji: {
    fontSize: 14,
  },
  categoryChipText: {
    fontSize: 13,
    color: '#11181C',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#fff',
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
  resetButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  resetButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
