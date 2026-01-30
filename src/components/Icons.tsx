import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

type IconProps = {
  size?: number;
  color?: string;
};

export const HomeIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="home" size={size} color={color} />
);

export const MenuIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="restaurant" size={size} color={color} />
);

export const CartIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="cart" size={size} color={color} />
);

export const OrdersIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="receipt" size={size} color={color} />
);

export const ProfileIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="person" size={size} color={color} />
);

export const BurgerIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <FontAwesome5 name="hamburger" size={size} color={color} />
);

export const MainsIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <MaterialCommunityIcons name="food-turkey" size={size} color={color} />
);

export const StartersIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <MaterialCommunityIcons name="food-croissant" size={size} color={color} />
);

export const DessertsIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <MaterialCommunityIcons name="cupcake" size={size} color={color} />
);

export const BeveragesIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <MaterialCommunityIcons name="cup" size={size} color={color} />
);

export const AlcoholIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <MaterialCommunityIcons name="glass-wine" size={size} color={color} />
);

export const PlusIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="add" size={size} color={color} />
);

export const MinusIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="remove" size={size} color={color} />
);

export const TrashIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="trash-outline" size={size} color={color} />
);

export const EditIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Feather name="edit-2" size={size} color={color} />
);

export const BackIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="arrow-back" size={size} color={color} />
);

export const CloseIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="close" size={size} color={color} />
);

export const CheckIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="checkmark" size={size} color={color} />
);

export const CardIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="card" size={size} color={color} />
);

export const CashIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="cash" size={size} color={color} />
);

export const LocationIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="location" size={size} color={color} />
);

export const ChartIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="bar-chart" size={size} color={color} />
);

export const SettingsIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="settings" size={size} color={color} />
);

export const AdminIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <MaterialIcons name="admin-panel-settings" size={size} color={color} />
);

export const PackageIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Feather name="package" size={size} color={color} />
);

export const TrendingUpIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Feather name="trending-up" size={size} color={color} />
);

export const DollarIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Feather name="dollar-sign" size={size} color={color} />
);

export const UsersIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Feather name="users" size={size} color={color} />
);

export const getCategoryIcon = (categoryId: string, size = 24, color = '#11181C') => {
  switch (categoryId) {
    case 'burgers':
      return <BurgerIcon size={size} color={color} />;
    case 'mains':
      return <MainsIcon size={size} color={color} />;
    case 'starters':
      return <StartersIcon size={size} color={color} />;
    case 'desserts':
      return <DessertsIcon size={size} color={color} />;
    case 'beverages':
      return <BeveragesIcon size={size} color={color} />;
    case 'alcohol':
      return <AlcoholIcon size={size} color={color} />;
    default:
      return <MenuIcon size={size} color={color} />;
  }
};

export const EmptyCartIcon = ({ size = 64, color = '#9ca3af' }: IconProps) => (
  <Ionicons name="cart-outline" size={size} color={color} />
);

export const EmptyOrdersIcon = ({ size = 64, color = '#9ca3af' }: IconProps) => (
  <Ionicons name="receipt-outline" size={size} color={color} />
);

export const UserOutlineIcon = ({ size = 64, color = '#9ca3af' }: IconProps) => (
  <Ionicons name="person-outline" size={size} color={color} />
);

export const RestaurantIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="restaurant-outline" size={size} color={color} />
);

export const FoodIcon = ({ size = 64, color = '#11181C' }: IconProps) => (
  <Ionicons name="fast-food" size={size} color={color} />
);

export const ChevronRightIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="chevron-forward" size={size} color={color} />
);

export const RefreshIcon = ({ size = 24, color = '#11181C' }: IconProps) => (
  <Ionicons name="refresh" size={size} color={color} />
);
