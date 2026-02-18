import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, FoodItem, CartItemCustomization } from '../types';
import { useMenu } from './MenuContext';

interface CartContextType {
  items: CartItem[];
  addItem: (foodItem: FoodItem, quantity: number, customization: CartItemCustomization) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateCustomization: (itemId: string, customization: CartItemCustomization) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = '@eatery_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { menuItems } = useMenu();

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [items]);

  useEffect(() => {
    // Keep cart item pricing in sync when admins update menu data.
    setItems((prev) =>
      prev.map((item) => {
        const latest = menuItems.find((menuItem) => menuItem.id === item.foodItem.id);
        if (!latest) return item;

        const totalPrice = calculateItemTotal(latest, item.quantity, item.customization);
        return { ...item, foodItem: latest, totalPrice };
      })
    );
  }, [menuItems]);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_KEY);
      if (cartData) {
        setItems(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const calculateItemTotal = (foodItem: FoodItem, quantity: number, customization: CartItemCustomization): number => {
    let basePrice = foodItem.price;
    
    customization.selectedDrinks.forEach(drink => {
      if (!drink.included) {
        basePrice += drink.price;
      }
    });
    
    customization.selectedExtras.forEach(extra => {
      basePrice += extra.price;
    });
    
    return basePrice * quantity;
  };

  const addItem = (foodItem: FoodItem, quantity: number, customization: CartItemCustomization) => {
    const totalPrice = calculateItemTotal(foodItem, quantity, customization);
    const newItem: CartItem = {
      id: Date.now().toString(),
      foodItem,
      quantity,
      customization,
      totalPrice,
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const totalPrice = calculateItemTotal(item.foodItem, quantity, item.customization);
        return { ...item, quantity, totalPrice };
      }
      return item;
    }));
  };

  const updateCustomization = (itemId: string, customization: CartItemCustomization) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const totalPrice = calculateItemTotal(item.foodItem, item.quantity, customization);
        return { ...item, customization, totalPrice };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = (): number => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const getItemCount = (): number => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, updateCustomization, clearCart, getTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
