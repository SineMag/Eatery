import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Food items
export async function getFoodItemsByCategory(categoryId: string) {
  const { data, error } = await supabase
    .from("food_items")
    .select(
      `
      *,
      food_categories (*),
      restaurants (*)
    `,
    )
    .eq("category_id", categoryId);

  if (error) throw error;
  return data;
}

// Restaurants
export async function getRestaurants() {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .order("rating", { ascending: false });

  if (error) throw error;
  return data;
}

// Orders
export async function createOrder(orderData: any) {
  const { data, error } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createOrderItem(orderItemData: any) {
  const { data, error } = await supabase
    .from("order_items")
    .insert(orderItemData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *,
        food_items (
          *,
          food_categories (*),
          restaurants (*)
        )
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// User Profiles
export async function createUserProfile(profileData: any) {
  const { data, error } = await supabase
    .from("user_profiles")
    .insert(profileData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, profileData: any) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(profileData)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Food Categories
export async function getFoodCategories() {
  const { data, error } = await supabase
    .from("food_categories")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw error;
  return data;
}

// Profile image operations
export async function uploadProfileImage(
  imageUri: string,
  userId: string,
): Promise<string> {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const fileExt = imageUri.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, blob);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("profiles").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
}

export function validateProfileImage(imageUri: string): boolean {
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const extension = imageUri.toLowerCase().substring(imageUri.lastIndexOf("."));
  return validExtensions.includes(extension);
}

export async function saveProfileImage(
  userId: string,
  imageUrl: string,
): Promise<void> {
  const { error } = await updateUserProfile(userId, {
    profile_image: imageUrl,
  });

  if (error) throw error;
}
