import AsyncStorage from "@react-native-async-storage/async-storage";

const PAYMENT_METHODS_KEY = "payment_methods";
const DELIVERY_ADDRESSES_KEY = "delivery_addresses";

export interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "apple" | "google";
  last4?: string;
  brand?: string;
  expiry?: string;
  isDefault: boolean;
}

export interface DeliveryAddress {
  id: string;
  name: string;
  street: string;
  suburb: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export class PaymentStorage {
  // Payment Methods
  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const data = await AsyncStorage.getItem(PAYMENT_METHODS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading payment methods:", error);
      return [];
    }
  }

  static async savePaymentMethods(methods: PaymentMethod[]): Promise<void> {
    try {
      await AsyncStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(methods));
    } catch (error) {
      console.error("Error saving payment methods:", error);
    }
  }

  static async addPaymentMethod(method: PaymentMethod): Promise<void> {
    try {
      const methods = await this.getPaymentMethods();

      // If setting as default, remove default from others
      if (method.isDefault) {
        methods.forEach((m) => (m.isDefault = false));
      }

      methods.push(method);
      await this.savePaymentMethods(methods);
    } catch (error) {
      console.error("Error adding payment method:", error);
    }
  }

  static async updatePaymentMethod(
    methodId: string,
    updates: Partial<PaymentMethod>,
  ): Promise<void> {
    try {
      const methods = await this.getPaymentMethods();
      const index = methods.findIndex((m) => m.id === methodId);

      if (index !== -1) {
        // If setting as default, remove default from others
        if (updates.isDefault) {
          methods.forEach((m) => (m.isDefault = false));
        }

        methods[index] = { ...methods[index], ...updates };
        await this.savePaymentMethods(methods);
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
    }
  }

  static async deletePaymentMethod(methodId: string): Promise<void> {
    try {
      const methods = await this.getPaymentMethods();
      const filtered = methods.filter((m) => m.id !== methodId);
      await this.savePaymentMethods(filtered);
    } catch (error) {
      console.error("Error deleting payment method:", error);
    }
  }

  // Delivery Addresses
  static async getDeliveryAddresses(): Promise<DeliveryAddress[]> {
    try {
      const data = await AsyncStorage.getItem(DELIVERY_ADDRESSES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading delivery addresses:", error);
      return [];
    }
  }

  static async saveDeliveryAddresses(
    addresses: DeliveryAddress[],
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        DELIVERY_ADDRESSES_KEY,
        JSON.stringify(addresses),
      );
    } catch (error) {
      console.error("Error saving delivery addresses:", error);
    }
  }

  static async addDeliveryAddress(address: DeliveryAddress): Promise<void> {
    try {
      const addresses = await this.getDeliveryAddresses();

      // If setting as default, remove default from others
      if (address.isDefault) {
        addresses.forEach((a) => (a.isDefault = false));
      }

      addresses.push(address);
      await this.saveDeliveryAddresses(addresses);
    } catch (error) {
      console.error("Error adding delivery address:", error);
    }
  }

  static async updateDeliveryAddress(
    addressId: string,
    updates: Partial<DeliveryAddress>,
  ): Promise<void> {
    try {
      const addresses = await this.getDeliveryAddresses();
      const index = addresses.findIndex((a) => a.id === addressId);

      if (index !== -1) {
        // If setting as default, remove default from others
        if (updates.isDefault) {
          addresses.forEach((a) => (a.isDefault = false));
        }

        addresses[index] = { ...addresses[index], ...updates };
        await this.saveDeliveryAddresses(addresses);
      }
    } catch (error) {
      console.error("Error updating delivery address:", error);
    }
  }

  static async deleteDeliveryAddress(addressId: string): Promise<void> {
    try {
      const addresses = await this.getDeliveryAddresses();
      const filtered = addresses.filter((a) => a.id !== addressId);
      await this.saveDeliveryAddresses(filtered);
    } catch (error) {
      console.error("Error deleting delivery address:", error);
    }
  }

  // Clear all data (for testing or logout)
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        PAYMENT_METHODS_KEY,
        DELIVERY_ADDRESSES_KEY,
      ]);
    } catch (error) {
      console.error("Error clearing payment data:", error);
    }
  }
}
