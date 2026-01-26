import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with your publishable key
// In production, this should come from environment variables
const STRIPE_PUBLISHABLE_KEY = "pk_test_51234567890abcdef"; // Replace with your actual key

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details: {
    name: string;
    email: string;
    address?: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

export const createPaymentIntent = async (
  amount: number,
  currency: string = "zar",
): Promise<PaymentIntent> => {
  try {
    // In a real app, this would call your backend API
    // For demo purposes, we'll create a mock payment intent
    const mockPaymentIntent: PaymentIntent = {
      id: `pi_${Date.now()}`,
      client_secret: `pi_${Date.now()}_secret_${Date.now()}`,
      amount: amount * 100, // Convert to cents
      currency: currency,
      status: "requires_payment_method",
    };

    return mockPaymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

export const confirmPayment = async (
  paymentIntentId: string,
  paymentMethodId: string,
): Promise<PaymentIntent> => {
  try {
    // In a real app, this would call your backend API
    // For demo purposes, we'll simulate payment confirmation
    const mockPaymentIntent: PaymentIntent = {
      id: paymentIntentId,
      client_secret: `pi_${Date.now()}_secret_${Date.now()}`,
      amount: 18750, // R187.50 in cents
      currency: "zar",
      status: "succeeded",
    };

    return mockPaymentIntent;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

export const createPaymentMethod = async (
  cardDetails: any,
): Promise<PaymentMethod> => {
  try {
    // In a real app, this would call Stripe API
    // For demo purposes, we'll create a mock payment method
    const mockPaymentMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: "card",
      card: {
        brand: cardDetails.brand || "visa",
        last4: cardDetails.last4 || "4242",
        exp_month: cardDetails.exp_month || 12,
        exp_year: cardDetails.exp_year || 2024,
      },
      billing_details: {
        name: cardDetails.name || "John Doe",
        email: cardDetails.email || "john@example.com",
        address: cardDetails.address,
      },
    };

    return mockPaymentMethod;
  } catch (error) {
    console.error("Error creating payment method:", error);
    throw error;
  }
};
