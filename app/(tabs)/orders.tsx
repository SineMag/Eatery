import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { useOrders } from '@/src/contexts/OrderContext';
import { 
  EmptyOrdersIcon, 
  ChevronRightIcon,
  OrdersIcon 
} from '@/src/components/Icons';

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#d97706' },
  confirmed: { bg: '#dbeafe', text: '#2563eb' },
  preparing: { bg: '#fce7f3', text: '#db2777' },
  ready: { bg: '#d1fae5', text: '#059669' },
  delivered: { bg: '#e5e7eb', text: '#374151' },
  cancelled: { bg: '#fee2e2', text: '#dc2626' },
};

export default function OrdersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getOrdersByUser } = useOrders();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <OrdersIcon size={24} color="#11181C" />
          <Text style={styles.title}>Orders</Text>
        </View>
        <View style={styles.emptyContainer}>
          <EmptyOrdersIcon size={80} color="#d1d5db" />
          <Text style={styles.emptyTitle}>Sign in to view orders</Text>
          <Text style={styles.emptyText}>
            Please sign in to see your order history.
          </Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const userOrders = getOrdersByUser(user.id);

  if (userOrders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <OrdersIcon size={24} color="#11181C" />
          <Text style={styles.title}>Orders</Text>
        </View>
        <View style={styles.emptyContainer}>
          <EmptyOrdersIcon size={80} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>
            Start ordering to see your order history here!
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/menu')}
          >
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <OrdersIcon size={24} color="#11181C" />
          <Text style={styles.title}>Orders</Text>
        </View>
        <Text style={styles.subtitle}>{userOrders.length} orders</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.ordersList}>
        {userOrders.map((order) => {
          const statusColor = statusColors[order.status] || statusColors.pending;
          const orderDate = new Date(order.createdAt).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => router.push(`/order/${order.id}`)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusColor.bg },
                  ]}
                >
                  <Text style={[styles.statusText, { color: statusColor.text }]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Text>
                </View>
              </View>

              <Text style={styles.orderDate}>{orderDate}</Text>

              <View style={styles.orderItems}>
                {order.items.slice(0, 3).map((item, index) => (
                  <Text key={index} style={styles.orderItemText}>
                    {item.quantity}x {item.foodItem.name}
                  </Text>
                ))}
                {order.items.length > 3 && (
                  <Text style={styles.moreItems}>
                    +{order.items.length - 3} more items
                  </Text>
                )}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>R{order.total.toFixed(2)}</Text>
                <View style={styles.viewDetails}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <ChevronRightIcon size={16} color="#3b82f6" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11181C',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: '#11181C',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  browseButton: {
    backgroundColor: '#11181C',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ordersList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  orderItems: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 12,
  },
  orderItemText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  moreItems: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
  },
  viewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
});
