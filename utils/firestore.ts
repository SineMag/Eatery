import { User } from "@/types";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const USERS_COLLECTION = "users";

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
