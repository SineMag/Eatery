 to login, for now limport { initStripe, useStripe, usePaymentSheet } from '@stripe/stripe-react-native';

// Initialize Stripe
export const initializeStripe = async () => {
  try {
    await initStripe({
      publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      merchantIdentifier: 'merchant.com.eatery',
    });
  } catch (error) {
    console.error('Error initializing Stripe:', error);
  }
};

// Payment method types
export type PaymentMethod = 'card' | 'eft' | 'cash';

export interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  orderId: string;
  customerEmail: string;
  paymentMethod: PaymentMethod;
}

// Process payment
export const processPayment = async (details: PaymentDetails): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    // For cash and EFT, we just record the payment method
    if (details.paymentMethod === 'cash' || details.paymentMethod === 'eft') {
      return {
        success: true,
        transactionId: `${details.paymentMethod.toUpperCase()}-${Date.now()}`,
      };
    }

    // For card payments, integrate with Stripe
    if (details.paymentMethod === 'card') {
      // This would be implemented with actual Stripe integration
      // For now, we'll simulate a successful payment
      return {
        success: true,
        transactionId: `CARD-${Date.now()}`,
      };
    }

    return {
      success: false,
      error: 'Invalid payment method',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Payment processing failed',
    };
  }
};

// Validate card details
export const validateCardDetails = (cardNumber: string, expiryDate: string, cvv: string): boolean => {
  // Basic validation
  if (!cardNumber || cardNumber.length < 13) return false;
  if (!expiryDate || expiryDate.length !== 5) return false;
  if (!cvv || cvv.length < 3) return false;

  // Luhn algorithm for card validation
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Format card number
export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

// Format expiry date
export const formatExpiryDate = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (v.length >= 2) {
    return v.slice(0, 2) + '/' + v.slice(2, 4);
  }
  return v;
};

// Get card type
export const getCardType = (cardNumber: string): string => {
  const patterns = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber.replace(/\s/g, ''))) {
      return type;
    }
  }

  return 'unknown';
};

// Mock payment processing for testing
export const mockProcessPayment = async (details: PaymentDetails): Promise<{ success: boolean; transactionId: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      });
    }, 2000);
  });
};
