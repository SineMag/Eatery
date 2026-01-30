import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useOrders } from '@/src/contexts/OrderContext';
import { BackIcon, CheckIcon, LocationIcon, CardIcon } from '@/src/components/Icons';

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#d97706' },
  confirmed: { bg: '#dbeafe', text: '#2563eb' },
  preparing: { bg: '#fce7f3', text: '#db2777' },
  ready: { bg: '#d1fae5', text: '#059669' },
  delivered: { bg: '#e5e7eb', text: '#374151' },
  cancelled: { bg: '#fee2e2', text: '#dc2626' },
};

const statusSteps = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { orders } = useOrders();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = statusColors[order.status] || statusColors.pending;
  const currentStepIndex = statusSteps.indexOf(order.status);
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <BackIcon size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.orderDate}>{orderDate}</Text>

        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Order Progress</Text>
            <View style={styles.progressContainer}>
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <View key={step} style={styles.progressStep}>
                    <View
                      style={[
                        styles.progressDot,
                        isCompleted && styles.progressDotCompleted,
                        isCurrent && styles.progressDotCurrent,
                      ]}
                    >
                      {isCompleted && <CheckIcon size={14} color="#fff" />}
                    </View>
                    <Text
                      style={[
                        styles.progressLabel,
                        isCompleted && styles.progressLabelCompleted,
                      ]}
                    >
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </Text>
                    {index < statusSteps.length - 1 && (
                      <View
                        style={[
                          styles.progressLine,
                          isCompleted && styles.progressLineCompleted,
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LocationIcon size={20} color="#11181C" />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <Text style={styles.addressText}>{order.deliveryAddress}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CardIcon size={20} color="#11181C" />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>
          <Text style={styles.paymentText}>{order.paymentMethod}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName}>
                  {item.quantity}x {item.foodItem.name}
                </Text>
                {item.customization.selectedSides.length > 0 && (
                  <Text style={styles.orderItemDetail}>
                    Sides: {item.customization.selectedSides.map((s) => s.name).join(', ')}
                  </Text>
                )}
                {item.customization.selectedExtras.length > 0 && (
                  <Text style={styles.orderItemDetail}>
                    Extras: {item.customization.selectedExtras.map((e) => e.name).join(', ')}
                  </Text>
                )}
              </View>
              <Text style={styles.orderItemPrice}>R{item.totalPrice.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Total</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R{order.total.toFixed(2)}</Text>
          </View>
        </View>

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#11181C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  headerButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11181C',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11181C',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  progressSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressDotCompleted: {
    backgroundColor: '#10b981',
  },
  progressDotCurrent: {
    backgroundColor: '#3b82f6',
  },
  progressLabel: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
  progressLabelCompleted: {
    color: '#374151',
    fontWeight: '500',
  },
  progressLine: {
    position: 'absolute',
    top: 16,
    left: '60%',
    right: '-40%',
    height: 2,
    backgroundColor: '#e5e7eb',
    zIndex: -1,
  },
  progressLineCompleted: {
    backgroundColor: '#10b981',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  addressText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  paymentText: {
    fontSize: 15,
    color: '#374151',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#11181C',
    marginBottom: 4,
  },
  orderItemDetail: {
    fontSize: 13,
    color: '#6b7280',
  },
  orderItemPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: '#11181C',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#11181C',
  },
});
