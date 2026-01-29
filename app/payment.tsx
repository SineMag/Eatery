import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  DeliveryAddress,
  PaymentMethod,
  PaymentStorage,
} from "@/utils/payment-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PaymentScreen() {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load data from storage on component mount
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>(
    [],
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [methods, addresses] = await Promise.all([
        PaymentStorage.getPaymentMethods(),
        PaymentStorage.getDeliveryAddresses(),
      ]);

      setPaymentMethods(methods);
      setDeliveryAddresses(addresses);

      // Set default selections
      const defaultMethod = methods.find((m) => m.isDefault);
      const defaultAddress = addresses.find((a) => a.isDefault);

      if (defaultMethod) setSelectedPaymentMethod(defaultMethod.id);
      if (defaultAddress) setSelectedAddress(defaultAddress.id);
    } catch (error) {
      console.error("Error loading payment data:", error);
    }
  };

  // New card form state
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
    setAsDefault: false,
  });

  // New address form state
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    suburb: "",
    city: "",
    postalCode: "",
    setAsDefault: false,
  });

  const handleAddCard = async () => {
    if (
      !newCard.cardNumber ||
      !newCard.expiry ||
      !newCard.cvv ||
      !newCard.name
    ) {
      Alert.alert("Error", "Please fill in all card details");
      return;
    }

    const card: PaymentMethod = {
      id: Date.now().toString(),
      type: "card",
      last4: newCard.cardNumber.slice(-4),
      brand: newCard.cardNumber.startsWith("4") ? "Visa" : "Mastercard",
      expiry: newCard.expiry,
      isDefault: newCard.setAsDefault,
    };

    try {
      await PaymentStorage.addPaymentMethod(card);

      // Reload data to get updated list
      const methods = await PaymentStorage.getPaymentMethods();
      setPaymentMethods(methods);

      // Set as selected if it's the only one or default
      if (methods.length === 1 || card.isDefault) {
        setSelectedPaymentMethod(card.id);
      }

      setNewCard({
        cardNumber: "",
        expiry: "",
        cvv: "",
        name: "",
        setAsDefault: false,
      });
      setShowAddCard(false);
      Alert.alert("Success", "Card added successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to save card");
      console.error("Error saving card:", error);
    }
  };

  const handleAddAddress = async () => {
    if (
      !newAddress.name ||
      !newAddress.street ||
      !newAddress.suburb ||
      !newAddress.city ||
      !newAddress.postalCode
    ) {
      Alert.alert("Error", "Please fill in all address fields");
      return;
    }

    const address: DeliveryAddress = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: newAddress.setAsDefault,
    };

    try {
      await PaymentStorage.addDeliveryAddress(address);

      // Reload data to get updated list
      const addresses = await PaymentStorage.getDeliveryAddresses();
      setDeliveryAddresses(addresses);

      // Set as selected if it's the only one or default
      if (addresses.length === 1 || address.isDefault) {
        setSelectedAddress(address.id);
      }

      setNewAddress({
        name: "",
        street: "",
        suburb: "",
        city: "",
        postalCode: "",
        setAsDefault: false,
      });
      setShowAddAddress(false);
      Alert.alert("Success", "Address added successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to save address");
      console.error("Error saving address:", error);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      await PaymentStorage.deletePaymentMethod(id);
      const methods = await PaymentStorage.getPaymentMethods();
      setPaymentMethods(methods);

      if (selectedPaymentMethod === id) {
        setSelectedPaymentMethod("");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete payment method");
      console.error("Error deleting payment method:", error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await PaymentStorage.deleteDeliveryAddress(id);
      const addresses = await PaymentStorage.getDeliveryAddresses();
      setDeliveryAddresses(addresses);

      if (selectedAddress === id) {
        setSelectedAddress("");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete address");
      console.error("Error deleting address:", error);
    }
  };

  const handleSetDefaultPaymentMethod = async (id: string) => {
    try {
      await PaymentStorage.updatePaymentMethod(id, { isDefault: true });
      const methods = await PaymentStorage.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      Alert.alert("Error", "Failed to set default payment method");
      console.error("Error setting default payment method:", error);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await PaymentStorage.updateDeliveryAddress(id, { isDefault: true });
      const addresses = await PaymentStorage.getDeliveryAddresses();
      setDeliveryAddresses(addresses);
    } catch (error) {
      Alert.alert("Error", "Failed to set default address");
      console.error("Error setting default address:", error);
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }
    if (!selectedAddress) {
      Alert.alert("Error", "Please select a delivery address");
      return;
    }

    console.log("Starting payment process...");
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate order number
      const orderNum = `ORD-${Date.now().toString().slice(-8)}`;
      setOrderNumber(orderNum);

      setIsProcessing(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      Alert.alert(
        "Payment Error",
        "Failed to process payment. Please try again.",
      );
    }
  };

  const handleTrackOrder = () => {
    setShowSuccessModal(false);
    router.push("/(tabs)/orders");
  };

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    router.push("/");
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddAddress(true)}
            >
              <IconSymbol name="plus" size={16} color="#11181C" />
              <Text style={styles.addButtonText}>Add Address</Text>
            </TouchableOpacity>
          </View>

          {deliveryAddresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                selectedAddress === address.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedAddress(address.id)}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{address.name}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressText}>
                  {address.street}, {address.suburb}
                </Text>
                <Text style={styles.addressText}>
                  {address.city}, {address.postalCode}
                </Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleSetDefaultAddress(address.id)}
                >
                  <IconSymbol
                    name="star"
                    size={16}
                    color={address.isDefault ? "#fbbf24" : "#9ca3af"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteAddress(address.id)}
                >
                  <IconSymbol name="trash" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          {showAddAddress && (
            <View style={styles.addForm}>
              <TextInput
                style={styles.input}
                placeholder="Address Name (e.g., Home, Work)"
                value={newAddress.name}
                onChangeText={(text) =>
                  setNewAddress((prev) => ({ ...prev, name: text }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Street Address"
                value={newAddress.street}
                onChangeText={(text) =>
                  setNewAddress((prev) => ({ ...prev, street: text }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Suburb"
                value={newAddress.suburb}
                onChangeText={(text) =>
                  setNewAddress((prev) => ({ ...prev, suburb: text }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={newAddress.city}
                onChangeText={(text) =>
                  setNewAddress((prev) => ({ ...prev, city: text }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Postal Code"
                value={newAddress.postalCode}
                onChangeText={(text) =>
                  setNewAddress((prev) => ({ ...prev, postalCode: text }))
                }
              />
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Set as default</Text>
                <Switch
                  value={newAddress.setAsDefault}
                  onValueChange={(value) =>
                    setNewAddress((prev) => ({ ...prev, setAsDefault: value }))
                  }
                />
              </View>
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => setShowAddAddress(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formButton, styles.saveButton]}
                  onPress={handleAddAddress}
                >
                  <Text style={styles.saveButtonText}>Save Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Payment Methods Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddCard(true)}
            >
              <IconSymbol name="plus" size={16} color="#11181C" />
              <Text style={styles.addButtonText}>Add Card</Text>
            </TouchableOpacity>
          </View>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                selectedPaymentMethod === method.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardBrand}>
                    <IconSymbol
                      name={
                        method.brand === "Visa" ? "creditcard" : "creditcard"
                      }
                      size={20}
                      color="#11181C"
                    />
                    <Text style={styles.cardTitle}>{method.brand}</Text>
                  </View>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardNumber}>
                  •••• •••• •••• {method.last4}
                </Text>
                <Text style={styles.cardExpiry}>Expires {method.expiry}</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleSetDefaultPaymentMethod(method.id)}
                >
                  <IconSymbol
                    name="star"
                    size={16}
                    color={method.isDefault ? "#fbbf24" : "#9ca3af"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeletePaymentMethod(method.id)}
                >
                  <IconSymbol name="trash" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          {showAddCard && (
            <View style={styles.addForm}>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                value={newCard.cardNumber}
                onChangeText={(text) =>
                  setNewCard((prev) => ({
                    ...prev,
                    cardNumber: formatCardNumber(text),
                  }))
                }
                keyboardType="numeric"
                maxLength={19}
              />
              <TextInput
                style={styles.input}
                placeholder="Cardholder Name"
                value={newCard.name}
                onChangeText={(text) =>
                  setNewCard((prev) => ({ ...prev, name: text }))
                }
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="MM/YY"
                  value={newCard.expiry}
                  onChangeText={(text) =>
                    setNewCard((prev) => ({
                      ...prev,
                      expiry: formatExpiry(text),
                    }))
                  }
                  keyboardType="numeric"
                  maxLength={5}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="CVV"
                  value={newCard.cvv}
                  onChangeText={(text) =>
                    setNewCard((prev) => ({ ...prev, cvv: text }))
                  }
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Set as default</Text>
                <Switch
                  value={newCard.setAsDefault}
                  onValueChange={(value) =>
                    setNewCard((prev) => ({ ...prev, setAsDefault: value }))
                  }
                />
              </View>
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => setShowAddCard(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formButton, styles.saveButton]}
                  onPress={handleAddCard}
                >
                  <Text style={styles.saveButtonText}>Save Card</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>R150.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>R25.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>R12.50</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R187.50</Text>
          </View>
        </View>
      </ScrollView>

      {/* Payment Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay R187.50</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <IconSymbol
                name="checkmark.circle.fill"
                size={32}
                color="#10b981"
              />
              <Text style={styles.modalTitle}>Confirm Payment</Text>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.confirmationText}>
                Are you sure you want to proceed with the payment of R187.50?
              </Text>

              <View style={styles.paymentDetails}>
                <Text style={styles.detailLabel}>Payment Method:</Text>
                <Text style={styles.detailValue}>
                  {
                    paymentMethods.find((m) => m.id === selectedPaymentMethod)
                      ?.brand
                  }{" "}
                  •••• •••• ••••{" "}
                  {
                    paymentMethods.find((m) => m.id === selectedPaymentMethod)
                      ?.last4
                  }
                </Text>

                <Text style={styles.detailLabel}>Delivery Address:</Text>
                <Text style={styles.detailValue}>
                  {
                    deliveryAddresses.find((a) => a.id === selectedAddress)
                      ?.street
                  }
                  ,{" "}
                  {
                    deliveryAddresses.find((a) => a.id === selectedAddress)
                      ?.suburb
                  }
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={confirmPayment}
              >
                <Text style={styles.confirmModalButtonText}>
                  Confirm Payment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Processing Modal */}
      {isProcessing && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.spinner} />
              <Text style={styles.modalTitle}>Processing Payment</Text>
            </View>
            <Text style={styles.processingText}>
              Please wait while we process your payment...
            </Text>
          </View>
        </View>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <IconSymbol
                name="checkmark.circle.fill"
                size={48}
                color="#10b981"
              />
              <Text style={styles.modalTitle}>Order Placed Successfully!</Text>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.successInfo}>
                <Text style={styles.orderNumberLabel}>Order Number:</Text>
                <Text style={styles.orderNumber}>{orderNumber}</Text>
              </View>

              <Text style={styles.successMessage}>
                Your order has been successfully placed and will be delivered to
                your address.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.trackOrderButton]}
                onPress={handleTrackOrder}
              >
                <Text style={styles.trackOrderButtonText}>Track Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.continueShoppingButton]}
                onPress={handleContinueShopping}
              >
                <Text style={styles.continueShoppingButtonText}>
                  Continue Shopping
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#11181C",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#11181C",
  },
  addressCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  selectedCard: {
    borderColor: "#11181C",
    borderWidth: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  defaultBadge: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
  addressText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 12,
    color: "#9ca3af",
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
  },
  addForm: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    color: "#374151",
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  saveButton: {
    backgroundColor: "#11181C",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 14,
    color: "#11181C",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    backgroundColor: "#fff",
  },
  payButton: {
    backgroundColor: "#11181C",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  // Modal styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 400,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#11181C",
    textAlign: "center",
  },
  modalBody: {
    marginBottom: 24,
  },
  confirmationText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  paymentDetails: {
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: "#11181C",
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelModalButton: {
    backgroundColor: "#f3f4f6",
  },
  cancelModalButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmModalButton: {
    backgroundColor: "#11181C",
  },
  confirmModalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  spinner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#11181C",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
  processingText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 16,
  },
  successInfo: {
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  orderNumberLabel: {
    fontSize: 14,
    color: "#059669",
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#059669",
  },
  successMessage: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    lineHeight: 24,
  },
  trackOrderButton: {
    backgroundColor: "#10b981",
  },
  trackOrderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  continueShoppingButton: {
    backgroundColor: "#6b7280",
  },
  continueShoppingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
