export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      food_categories: {
        Row: {
          id: string;
          name: string;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      food_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category_id: string;
          restaurant_id: string;
          distance?: string;
          delivery_time?: string;
          sides?: Json;
          drinks?: Json;
          extras?: Json;
          optional_ingredients?: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category_id: string;
          restaurant_id: string;
          distance?: string;
          delivery_time?: string;
          sides?: Json;
          drinks?: Json;
          extras?: Json;
          optional_ingredients?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          category_id?: string;
          restaurant_id?: string;
          distance?: string;
          delivery_time?: string;
          sides?: Json;
          drinks?: Json;
          extras?: Json;
          optional_ingredients?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      restaurants: {
        Row: {
          id: string;
          name: string;
          description?: string;
          image_url?: string;
          rating?: number;
          address?: string;
          phone?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          image_url?: string;
          rating?: number;
          address?: string;
          phone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image_url?: string;
          rating?: number;
          address?: string;
          phone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          total: number;
          status:
            | "pending"
            | "confirmed"
            | "preparing"
            | "ready"
            | "delivered"
            | "cancelled";
          delivery_address: string;
          payment_method: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total: number;
          status?:
            | "pending"
            | "confirmed"
            | "preparing"
            | "ready"
            | "delivered"
            | "cancelled";
          delivery_address: string;
          payment_method: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total?: number;
          status?:
            | "pending"
            | "confirmed"
            | "preparing"
            | "ready"
            | "delivered"
            | "cancelled";
          delivery_address?: string;
          payment_method?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          food_item_id: string;
          quantity: number;
          subtotal: number;
          selected_sides?: Json;
          selected_drinks?: Json;
          selected_extras?: Json;
          selected_ingredients?: Json;
          customizations?: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          food_item_id: string;
          quantity: number;
          subtotal: number;
          selected_sides?: Json;
          selected_drinks?: Json;
          selected_extras?: Json;
          selected_ingredients?: Json;
          customizations?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          food_item_id?: string;
          quantity?: number;
          subtotal?: number;
          selected_sides?: Json;
          selected_drinks?: Json;
          selected_extras?: Json;
          selected_ingredients?: Json;
          customizations?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          surname?: string;
          contact_number?: string;
          address?: string;
          profile_image?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          surname?: string;
          contact_number?: string;
          address?: string;
          profile_image?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          surname?: string;
          contact_number?: string;
          address?: string;
          profile_image?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
