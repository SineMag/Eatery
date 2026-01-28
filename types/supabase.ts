

import { Database } from "./database";

// Supabase table types based on the database schema
export type FoodCategory =
  Database["public"]["Tables"]["food_categories"]["Row"];
export type FoodItem = Database["public"]["Tables"]["food_items"]["Row"];
export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

// Insert types for creating new records
export type FoodCategoryInsert =
  Database["public"]["Tables"]["food_categories"]["Insert"];
export type FoodItemInsert =
  Database["public"]["Tables"]["food_items"]["Insert"];
export type RestaurantInsert =
  Database["public"]["Tables"]["restaurants"]["Insert"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderItemInsert =
  Database["public"]["Tables"]["order_items"]["Insert"];
export type UserProfileInsert =
  Database["public"]["Tables"]["user_profiles"]["Insert"];

// Update types for updating existing records
export type FoodCategoryUpdate =
  Database["public"]["Tables"]["food_categories"]["Update"];
export type FoodItemUpdate =
  Database["public"]["Tables"]["food_items"]["Update"];
export type RestaurantUpdate =
  Database["public"]["Tables"]["restaurants"]["Update"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];
export type OrderItemUpdate =
  Database["public"]["Tables"]["order_items"]["Update"];
export type UserProfileUpdate =
  Database["public"]["Tables"]["user_profiles"]["Update"];

// Helper types for joins and relationships
export type FoodItemWithCategory = FoodItem & {
  food_categories: FoodCategory | null;
  restaurants: Restaurant | null;
};

export type OrderWithItems = Order & {
  order_items: (OrderItem & {
    food_items: FoodItemWithCategory | null;
  })[];
};

export type UserProfileWithAuth = UserProfile & {
  auth_user: {
    id: string;
    email: string;
    created_at: string;
  };
};
