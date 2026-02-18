import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '@/src/contexts/CartContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { useOrders } from '@/src/contexts/OrderContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { 
  BackIcon, 
  CardIcon, 
  CashIcon, 
  LocationIcon, 
  CheckIcon,
  PlusIcon 
} from '@/src/components/Icons';

interface SavedCard {
  id: string;
  number: string;
  expiry: string;
  isDefault: boolean;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { user, updateProfile } = useAuth();
  const { addOrder } = useOrders();
  const { isDesktop } = useResponsive();

  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [loading, setLoading] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });

  const savedCards: SavedCard[] = user?.cardNumber ? [
    { 
      id: '1', 
      number: user.cardNumber, 
      expiry: user.cardExpiry || '', 
      isDefault: true 
    }
  ] : [];

  const subtotal = getTotal();
  const deliveryFee = 25;
  const tax = subtotal * 0.15;
  const total = subtotal + deliveryFee + tax;

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <Text style={styles.authTitle}>Sign in to Checkout</Text>
          <Text style={styles.authText}>
            Please sign in or create an account to place your order.
          </Text>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.authButtonSecondary}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.authButtonSecondaryText}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backToCartText}>Back to Cart</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    router.replace('/cart');
    return null;
  }

  const handleAddCard = async () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvv) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    await updateProfile({
      cardNumber: newCard.number.replace(/\s/g, ''),
      cardExpiry: newCard.expiry,
      cardCVV: newCard.cvv,
    });

    setShowAddCard(false);
    setNewCard({ number: '', expiry: '', cvv: '' });
    Alert.alert('Success', 'Card added successfully!');
  };

  const simulatePayment = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1;
        resolve(success);
      }, 1500);
    });
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Error', 'Please enter a delivery address');
      return;
    }

    if (paymentMethod === 'card' && savedCards.length === 0) {
      Alert.alert('Error', 'Please add a card or choose cash on delivery');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'card') {
        const paymentSuccess = await simulatePayment();
        if (!paymentSuccess) {
          Alert.alert('Payment Failed', 'Your payment could not be processed. Please try again.');
          setLoading(false);
          return;
        }
      }

      const selectedCard = savedCards[selectedCardIndex];
      const cardDisplay = selectedCard
        ? `Card •••• ${selectedCard.number.slice(-4)}`
        : 'Cash on Delivery';

      const order = await addOrder({
        userId: user.id,
        items: items,
        total: total,
        status: 'pending',
        deliveryAddress: deliveryAddress.trim(),
        paymentMethod: paymentMethod === 'card' ? cardDisplay : 'Cash on Delivery',
        userName: `${user.name} ${user.surname}`,
        userContact: user.contactNumber,
      });

      clearCart();

      Alert.alert(
        'Order Placed!',
        paymentMethod === 'card' 
          ? 'Payment successful! Your delicious food is being prepared.'
          : 'Your order is confirmed! Pay when you receive your food.',
        [
          { text: 'Go Home', onPress: () => router.replace('/') },
          { text: 'Track Order', onPress: () => router.replace(`/order/${order.id}`) },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, isDesktop && styles.headerDesktop]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <BackIcon size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={[styles.title, isDesktop && styles.titleDesktop]}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={isDesktop && styles.checkoutGrid}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LocationIcon size={20} color="#11181C" />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="Enter your delivery address"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            multiline
          />
          {user.address && deliveryAddress !== user.address && (
            <TouchableOpacity 
              style={styles.useDefaultButton}
              onPress={() => setDeliveryAddress(user.address)}
            >
              <Text style={styles.useDefaultText}>Use saved address</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CardIcon size={20} color="#11181C" />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={styles.paymentOptionContent}>
              <CardIcon size={24} color={paymentMethod === 'card' ? '#11181C' : '#6b7280'} />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentOptionTitle}>Card Payment</Text>
                {savedCards.length > 0 ? (
                  <Text style={styles.paymentOptionSubtitle}>
                    •••• •••• •••• {savedCards[selectedCardIndex]?.number.slice(-4)}
                  </Text>
                ) : (
                  <Text style={styles.paymentOptionSubtitle}>No card saved</Text>
                )}
              </View>
            </View>
            <View style={[styles.radio, paymentMethod === 'card' && styles.radioSelected]}>
              {paymentMethod === 'card' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          {paymentMethod === 'card' && (
            <View style={styles.cardSection}>
              {savedCards.map((card, index) => (
                <TouchableOpacity 
                  key={card.id} 
                  style={[
                    styles.savedCard,
                    selectedCardIndex === index && styles.savedCardSelected
                  ]}
                  onPress={() => setSelectedCardIndex(index)}
                >
                  <CardIcon size={20} color="#11181C" />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardNumber}>•••• {card.number.slice(-4)}</Text>
                    <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
                  </View>
                  {selectedCardIndex === index && (
                    <CheckIcon size={20} color="#10b981" />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.addCardButton}
                onPress={() => setShowAddCard(true)}
              >
                <PlusIcon size={18} color="#3b82f6" />
                <Text style={styles.addCardText}>Add New Card</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cash' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <View style={styles.paymentOptionContent}>
              <CashIcon size={24} color={paymentMethod === 'cash' ? '#11181C' : '#6b7280'} />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentOptionTitle}>Cash on Delivery</Text>
                <Text style={styles.paymentOptionSubtitle}>Pay when you receive</Text>
              </View>
            </View>
            <View style={[styles.radio, paymentMethod === 'cash' && styles.radioSelected]}>
              {paymentMethod === 'cash' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemName}>
                {item.quantity}x {item.foodItem.name}
              </Text>
              <Text style={styles.orderItemPrice}>R{item.totalPrice.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        </View>
        <View style={{ height: 200 }} />
      </ScrollView>

      <View style={[styles.footer, isDesktop && styles.footerDesktop]}>
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
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.placeOrderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderButtonText}>
            {loading ? 'Processing Payment...' : `Pay R${total.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showAddCard} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Card</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="1234 5678 9012 3456"
                value={newCard.number}
                onChangeText={(text) => setNewCard({...newCard, number: text})}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.cardRow}>
              <View style={[styles.inputGroup, {flex: 1}]}>
                <Text style={styles.inputLabel}>Expiry</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="MM/YY"
                  value={newCard.expiry}
                  onChangeText={(text) => setNewCard({...newCard, expiry: text})}
                  maxLength={5}
                />
              </View>
              <View style={[styles.inputGroup, {flex: 1, marginLeft: 12}]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="123"
                  value={newCard.cvv}
                  onChangeText={(text) => setNewCard({...newCard, cvv: text})}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonCancel}
                onPress={() => setShowAddCard(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonSave}
                onPress={handleAddCard}
              >
                <Text style={styles.modalButtonSaveText}>Save Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 12,
  },
  authText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  authButton: {
    backgroundColor: '#11181C',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  authButtonSecondary: {
    backgroundColor: '#fff',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#11181C',
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  authButtonSecondaryText: {
    color: '#11181C',
    fontSize: 16,
    fontWeight: '600',
  },
  backToCartText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
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
  addressInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  useDefaultButton: {
    marginTop: 8,
  },
  useDefaultText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    marginBottom: 10,
  },
  paymentOptionSelected: {
    borderColor: '#11181C',
    backgroundColor: '#f8fafc',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#11181C',
  },
  paymentOptionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#11181C',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#11181C',
  },
  cardSection: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  savedCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  cardInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#11181C',
  },
  cardExpiry: {
    fontSize: 12,
    color: '#6b7280',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 10,
    borderStyle: 'dashed',
  },
  addCardText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  orderItemName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#11181C',
  },
  footer: {
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
  placeOrderButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderButtonDisabled: {
    opacity: 0.7,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 20,
    textAlign: 'center',
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
  modalInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#11181C',
  },
  cardRow: {
    flexDirection: 'row',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  modalButtonSave: {
    flex: 1,
    backgroundColor: '#11181C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonSaveText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  headerDesktop: {
    paddingHorizontal: 40,
  },
  titleDesktop: {
    fontSize: 28,
  },
  checkoutGrid: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  footerDesktop: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
});
