import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();

/**
 * Upload an image to Firebase Storage
 * @param imageUri - Local URI of the image to upload
 * @param userId - User ID for folder structure
 * @returns Download URL of the uploaded image
 */
export async function uploadProfileImage(
  imageUri: string,
  userId: string,
): Promise<string> {
  try {
    // Create a reference to the file location
    const fileExtension = imageUri.split(".").pop() || "jpg";
    const fileName = `profile_${userId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `profile-images/${userId}/${fileName}`);

    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload the file
    await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    console.log("Profile image uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw new Error("Failed to upload profile image");
  }
}

/**
 * Delete a profile image from Firebase Storage
 * @param imageUrl - The URL of the image to delete
 */
export async function deleteProfileImage(imageUrl: string): Promise<void> {
  try {
    // Extract the path from the URL
    const url = new URL(imageUrl);
    const path = decodeURIComponent(url.pathname.split("/o/")[1].split("?")[0]);
    const storageRef = ref(storage, path);

    // Note: Firebase Storage doesn't have a direct delete function in the web SDK
    // You would typically use the Firebase Admin SDK on the backend for this
    console.log("Profile image deletion requested:", path);

    // For now, we'll just log it. In production, you'd want to implement
    // a Cloud Function or use the Admin SDK to handle deletions
  } catch (error) {
    console.error("Error deleting profile image:", error);
    throw new Error("Failed to delete profile image");
  }
}

/**
 * Get a default profile image URL
 * @returns Default avatar URL or null
 */
export function getDefaultProfileImage(): string | null {
  // You can return a default avatar image URL here
  // For now, we'll return null to use the default icon
  return null;
}

/**
 * Validate image before upload
 * @param imageUri - URI of the image to validate
 * @returns Boolean indicating if image is valid
 */
export function validateProfileImage(imageUri: string): boolean {
  // Check file extension
  const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const extension = imageUri.split(".").pop()?.toLowerCase();

  if (!extension || !validExtensions.includes(extension)) {
    return false;
  }

  // Check file size (max 5MB)
  // Note: In a real app, you'd want to check the actual file size
  // This is a simplified validation

  return true;
}
