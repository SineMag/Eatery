import { Tabs } from 'expo-router';
import { Redirect } from 'expo-router';
import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCart } from '@/src/contexts/CartContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { 
  HomeIcon, 
  MenuIcon, 
  CartIcon, 
  OrdersIcon, 
  ProfileIcon 
} from '@/src/components/Icons';

function TabIcon({ name, color, focused, badge }: { name: string; color: string; focused: boolean; badge?: number }) {
  const iconColor = focused ? '#11181C' : '#9ca3af';
  const size = 24;
  
  const renderIcon = () => {
    switch (name) {
      case 'home':
        return <HomeIcon size={size} color={iconColor} />;
      case 'menu':
        return <MenuIcon size={size} color={iconColor} />;
      case 'cart':
        return <CartIcon size={size} color={iconColor} />;
      case 'orders':
        return <OrdersIcon size={size} color={iconColor} />;
      case 'profile':
        return <ProfileIcon size={size} color={iconColor} />;
      default:
        return <MenuIcon size={size} color={iconColor} />;
    }
  };
  
  return (
    <View style={styles.iconContainer}>
      {renderIcon()}
      {badge !== undefined && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { getItemCount } = useCart();
  const { user, isLoading } = useAuth();
  const cartCount = getItemCount();

  if (isLoading) {
    return null;
  }

  if (user?.isAdmin || user?.isStaff) {
    return <Redirect href="/admin" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#11181C',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          height: Platform.OS === 'ios' ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon name="home" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, focused }) => <TabIcon name="menu" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => <TabIcon name="cart" color={color} focused={focused} badge={cartCount} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => <TabIcon name="orders" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <TabIcon name="profile" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
