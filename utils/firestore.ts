import { User, FoodItem } from "@/types";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const USERS_COLLECTION = "users";
const FOOD_ITEMS_COLLECTION = "foodItems"; // New constant for food items collection

/**
 * Save user profile data to Firestore
 * @param userId - User ID
 * @param userData - User data to save
 */
export async function saveUserProfile(
  userId: string,
  userData: Partial<User>,
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userRef, userData, { merge: true });
    console.log("User profile saved successfully");
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw new Error("Failed to save user profile");
  }
}

/**
 * Update user profile data in Firestore
 * @param userId - User ID
 * @param userData - User data to update
 */
export async function updateUserProfile(
  userId: string,
  userData: Partial<User>,
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, userData);
    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
}

/**
 * Fetch user profile from Firestore
 * @param userId - User ID
 * @returns User data or null if not found
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
}

/**
 * Save or update user profile image URL
 * @param userId - User ID
 * @param profileImageUrl - URL of the profile image
 */
export async function saveProfileImage(
  userId: string,
  profileImageUrl: string,
): Promise<void> {
  try {
    await updateUserProfile(userId, { profileImage: profileImageUrl });
    console.log("Profile image URL saved successfully");
  } catch (error) {
    console.error("Error saving profile image URL:", error);
    throw new Error("Failed to save profile image URL");
  }
}

/**
 * Create initial user profile in Firestore
 * @param userId - User ID
 * @param email - User email
 * @param name - User name
 * @param surname - User surname
 */
export async function createInitialUserProfile(
  userId: string,
  email: string,
  name: string = "",
  surname: string = "",
): Promise<void> {
  try {
    const initialUserData: User = {
      uid: userId,
      email,
      name,
      surname,
      contactNumber: "",
      address: "",
    };

    await saveUserProfile(userId, initialUserData);
    console.log("Initial user profile created successfully");
  } catch (error) {
    console.error("Error creating initial user profile:", error);
    throw new Error("Failed to create initial user profile");
  }
}

/**
 * Check if user profile exists in Firestore
 * @param userId - User ID
 * @returns Boolean indicating if profile exists
 */
export async function userProfileExists(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists();
  } catch (error) {
    console.error("Error checking user profile existence:", error);
    return false;
  }
}

// --- Food Item Management ---

/**
 * Add a new food item to Firestore
 * @param item - The FoodItem object to add
 * @returns The ID of the newly added item
 */
export async function addFoodItem(item: Omit<FoodItem, "id">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, FOOD_ITEMS_COLLECTION), item);
    console.log("Food item added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding food item:", error);
    throw new Error("Failed to add food item");
  }
}

/**
 * Fetch all food items for a given category from Firestore
 * @param categoryId - The ID of the category to filter by
 * @returns An array of FoodItem objects
 */
export async function getFoodItemsByCategory(
  categoryId: string,
): Promise<FoodItem[]> {
  try {
    const q = query(
      collection(db, FOOD_ITEMS_COLLECTION),
      where("categoryId", "==", categoryId),
    );
    const querySnapshot = await getDocs(q);
    const foodItems: FoodItem[] = [];
    querySnapshot.forEach((doc) => {
      foodItems.push({ id: doc.id, ...doc.data() } as FoodItem);
    });
    console.log(
      `Fetched ${foodItems.length} food items for category: ${categoryId}`,
    );
    return foodItems;
  } catch (error) {
    console.error(`Error fetching food items for category ${categoryId}:`, error);
    throw new Error("Failed to fetch food items by category");
  }
}

/**
 * Fetch a single food item by its ID from Firestore
 * @param itemId - The ID of the food item to fetch
 * @returns The FoodItem object or null if not found
 */
export async function getFoodItem(itemId: string): Promise<FoodItem | null> {
  try {
    const itemRef = doc(db, FOOD_ITEMS_COLLECTION, itemId);
    const itemDoc = await getDoc(itemRef);

    if (itemDoc.exists()) {
      return { id: itemDoc.id, ...itemDoc.data() } as FoodItem;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching food item ${itemId}:`, error);
    throw new Error("Failed to fetch food item");
  }
}

/**
 * Update an existing food item in Firestore
 * @param itemId - The ID of the food item to update
 * @param updates - Partial FoodItem object with fields to update
 */
export async function updateFoodItem(
  itemId: string,
  updates: Partial<FoodItem>,
): Promise<void> {
  try {
    const itemRef = doc(db, FOOD_ITEMS_COLLECTION, itemId);
    await updateDoc(itemRef, updates);
    console.log(`Food item ${itemId} updated successfully`);
  } catch (error) {
    console.error(`Error updating food item ${itemId}:`, error);
    throw new Error("Failed to update food item");
  }
}

/**
 * Delete a food item from Firestore
 * @param itemId - The ID of the food item to delete
 */
export async function deleteFoodItem(itemId: string): Promise<void> {
  try {
    const itemRef = doc(db, FOOD_ITEMS_COLLECTION, itemId);
    await deleteDoc(itemRef);
    console.log(`Food item ${itemId} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting food item ${itemId}:`, error);
    throw new Error("Failed to delete food item");
  }
}
