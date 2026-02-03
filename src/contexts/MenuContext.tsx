import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem, FoodCategory } from '../types';
import { foodItems as defaultFoodItems, categories as defaultCategories } from '../data/menuData';

interface MenuContextType {
  menuItems: FoodItem[];
  categories: FoodCategory[];
  addMenuItem: (item: Omit<FoodItem, 'id'>) => Promise<FoodItem>;
  updateMenuItem: (id: string, updates: Partial<FoodItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  getMenuItemById: (id: string) => FoodItem | undefined;
  getItemsByCategory: (categoryId: string) => FoodItem[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const MENU_ITEMS_KEY = '@eatery_menu_items';

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<FoodItem[]>(defaultFoodItems);

  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    if (menuItems.length > 0) {
      saveMenuItems();
    }
  }, [menuItems]);

  const loadMenuItems = async () => {
    try {
      const savedItems = await AsyncStorage.getItem(MENU_ITEMS_KEY);
      if (savedItems) {
        setMenuItems(JSON.parse(savedItems));
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  const saveMenuItems = async () => {
    try {
      await AsyncStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(menuItems));
    } catch (error) {
      console.error('Error saving menu items:', error);
    }
  };

  const addMenuItem = async (itemData: Omit<FoodItem, 'id'>): Promise<FoodItem> => {
    const newItem: FoodItem = {
      ...itemData,
      id: Date.now().toString(),
    };
    setMenuItems(prev => [...prev, newItem]);
    return newItem;
  };

  const updateMenuItem = async (id: string, updates: Partial<FoodItem>): Promise<void> => {
    setMenuItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteMenuItem = async (id: string): Promise<void> => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const getMenuItemById = (id: string): FoodItem | undefined => {
    return menuItems.find(item => item.id === id);
  };

  const getItemsByCategory = (categoryId: string): FoodItem[] => {
    return menuItems.filter(item => item.categoryId === categoryId);
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        categories: defaultCategories,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        getMenuItemById,
        getItemsByCategory,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
