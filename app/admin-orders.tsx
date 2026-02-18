import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { useOrders } from '@/src/contexts/OrderContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { BackIcon, OrdersIcon } from '@/src/components/Icons';
import { Order } from '@/src/types';

type SortOption = 'date_desc' | 'date_asc' | 'order_number' | 'status';
type FilterOption = 'all' | Order['status'];

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#d97706' },
  confirmed: { bg: '#dbeafe', text: '#2563eb' },
  preparing: { bg: '#fce7f3', text: '#db2777' },
  ready: { bg: '#d1fae5', text: '#059669' },
  delivered: { bg: '#e5e7eb', text: '#374151' },
  cancelled: { bg: '#fee2e2', text: '#dc2626' },
  deleted: { bg: '#f3f4f6', text: '#6b7280' },
};

const sortOptions: Array<{ id: SortOption; label: string }> = [
  { id: 'date_desc', label: 'Newest' },
  { id: 'date_asc', label: 'Oldest' },
  { id: 'order_number', label: 'Order No.' },
  { id: 'status', label: 'Status' },
];

const filterOptions: Array<{ id: FilterOption; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'deleted', label: 'Deleted' },
];

export default function AdminOrdersScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { orders } = useOrders();
  const { isDesktop } = useResponsive();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = orders.filter((order) => {
      const matchesStatus = filterBy === 'all' ? true : order.status === filterBy;
      const orderNumber = order.id.slice(-6).toLowerCase();
      const customerName = (order.userName || '').toLowerCase();
      const matchesSearch = !query || orderNumber.includes(query) || customerName.includes(query);
      return matchesStatus && matchesSearch;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'date_asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'order_number') return a.id.localeCompare(b.id);
      return a.status.localeCompare(b.status);
    });

    return result;
  }, [orders, search, sortBy, filterBy]);

  if (isLoading) return null;
  if (!user) return <Redirect href="/auth/staff-entry" />;
  if (!user.isAdmin && !user.isStaff) return <Redirect href="/" />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, isDesktop && styles.headerDesktop]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <BackIcon size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.title}>All Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.controls, isDesktop && styles.controlsDesktop]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by order number or client name"
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.chip, sortBy === option.id && styles.chipActive]}
              onPress={() => setSortBy(option.id)}
            >
              <Text style={[styles.chipText, sortBy === option.id && styles.chipTextActive]}>
                Sort: {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.chip, filterBy === option.id && styles.chipActive]}
              onPress={() => setFilterBy(option.id)}
            >
              <Text style={[styles.chipText, filterBy === option.id && styles.chipTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <OrdersIcon size={52} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No matching orders</Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const statusColor = statusColors[order.status] || statusColors.pending;
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-ZA', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderTopRow}>
                  <Text style={styles.orderId}>#{order.id.slice(-6)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                    <Text style={[styles.statusText, { color: statusColor.text }]}>{order.status}</Text>
                  </View>
                </View>
                <Text style={styles.orderMeta}>{orderDate}</Text>
                <Text style={styles.orderMeta}>{order.userName || 'Unknown'} - {order.userContact || 'N/A'}</Text>
                <Text style={styles.orderAddress} numberOfLines={1}>{order.deliveryAddress}</Text>
                <Text style={styles.orderTotal}>R{order.total.toFixed(2)}</Text>
              </View>
            );
          })
        )}
        <View style={{ height: 20 }} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerDesktop: {
    paddingHorizontal: 32,
  },
  headerButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#11181C',
  },
  controls: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    gap: 10,
  },
  controlsDesktop: {
    paddingHorizontal: 32,
  },
  searchInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#11181C',
  },
  chipsRow: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#11181C',
    borderColor: '#11181C',
  },
  chipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#11181C',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  orderMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 6,
  },
  orderAddress: {
    fontSize: 13,
    color: '#374151',
    marginTop: 4,
  },
  orderTotal: {
    marginTop: 10,
    fontSize: 16,
    color: '#11181C',
    fontWeight: '700',
  },
});
