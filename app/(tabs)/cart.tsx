import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '@/src/contexts/CartContext';
import { useAuth } from '@/src/contexts/AuthContext';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in or create an account to place an order.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth/login') },
          { text: 'Register', onPress: () => router.push('/auth/register') },
        ]
      );
      return;
    }
    router.push('/checkout');
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const subtotal = getTotal();
  const deliveryFee = 25;
  const tax = subtotal * 0.15;
  const total = subtotal + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Add some delicious items to get started!
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
        <Text style={styles.title}>Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.itemsList}>
        {items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image
              source={{ uri: item.foodItem.image }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.foodItem.name}</Text>
              <View style={styles.customizations}>
                {item.customization.selectedSides.length > 0 && (
                  <Text style={styles.customizationText}>
                    Sides: {item.customization.selectedSides.map((s) => s.name).join(', ')}
                  </Text>
                )}
                {item.customization.selectedDrinks.length > 0 && (
                  <Text style={styles.customizationText}>
                    Drinks: {item.customization.selectedDrinks.map((d) => d.name).join(', ')}
                  </Text>
                )}
                {item.customization.selectedExtras.length > 0 && (
                  <Text style={styles.customizationText}>
                    Extras: {item.customization.selectedExtras.map((e) => e.name).join(', ')}
                  </Text>
                )}
                {item.customization.removedIngredients.length > 0 && (
                  <Text style={styles.customizationText}>
                    No: {item.customization.removedIngredients.join(', ')}
                  </Text>
                )}
              </View>
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>R{item.totalPrice.toFixed(2)}</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>R{subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>R{deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>VAT (15%)</Text>
          <Text style={styles.summaryValue}>R{tax.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R{total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
  },
  clearButton: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
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
  itemsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  customizations: {
    marginTop: 4,
  },
  customizationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11181C',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    fontSize: 24,
    color: '#9ca3af',
    fontWeight: '300',
  },
  summary: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#11181C',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181C',
  },
  checkoutButton: {
    backgroundColor: '#11181C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
