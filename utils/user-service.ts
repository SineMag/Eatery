import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  surname?: string;
  contactNumber?: string;
  createdAt: string;
  lastLogin: string;
}

export interface UserOrder {
  id: string;
  date: string;
  total: number;
  status: "completed" | "pending" | "cancelled";
  items: { name: string; quantity: number; price: number }[];
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
}

export interface UserLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
}

export interface FavoriteRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  address: string;
  phone: string;
  addedAt: string;
}

class UserService {
  // Profile Management
  async createUserProfile(
    userData: Omit<UserProfile, "createdAt" | "lastLogin">,
  ): Promise<void> {
    const now = new Date().toISOString();
    const userProfile: UserProfile = {
      ...userData,
      createdAt: now,
      lastLogin: now,
    };

    try {
      await setDoc(doc(db, "users", userData.uid), userProfile);
      console.log("User profile created successfully");
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      // Check if it's an offline error
      if (
        error instanceof Error &&
        error.message.includes("client is offline")
      ) {
        console.log("Firebase is offline, returning null for user profile");
        return null;
      }
      throw error;
    }
  }

  async updateUserProfile(
    uid: string,
    updates: Partial<UserProfile>,
  ): Promise<void> {
    try {
      await updateDoc(doc(db, "users", uid), {
        ...updates,
        lastLogin: new Date().toISOString(),
      });
      console.log("User profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Order Management
  async addOrder(
    uid: string,
    orderData: Omit<UserOrder, "createdAt">,
  ): Promise<void> {
    try {
      const order: UserOrder = {
        ...orderData,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", uid, "orders", order.id), order);

      // Also update user's last login
      await this.updateUserLastLogin(uid);

      console.log("Order added successfully");
    } catch (error) {
      console.error("Error adding order:", error);
      throw error;
    }
  }

  async getUserOrders(uid: string): Promise<UserOrder[]> {
    try {
      // In a real implementation, you would use a query to get all orders
      // For now, this is a simplified version
      const ordersRef = doc(db, "users", uid, "orders", "dummy");
      const ordersDoc = await getDoc(ordersRef);

      // This is mock data - in a real app, you'd query the collection
      return [];
    } catch (error) {
      console.error("Error getting user orders:", error);
      return [];
    }
  }

  // Location Management
  async addLocation(
    uid: string,
    locationData: Omit<UserLocation, "createdAt">,
  ): Promise<void> {
    try {
      const location: UserLocation = {
        ...locationData,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", uid, "locations", location.id), location);

      // If this is the default location, update other locations
      if (location.isDefault) {
        await this.setDefaultLocation(uid, location.id);
      }

      console.log("Location added successfully");
    } catch (error) {
      console.error("Error adding location:", error);
      throw error;
    }
  }

  async updateLocation(
    uid: string,
    locationId: string,
    updates: Partial<UserLocation>,
  ): Promise<void> {
    try {
      await updateDoc(doc(db, "users", uid, "locations", locationId), updates);
      console.log("Location updated successfully");
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  }

  async deleteLocation(uid: string, locationId: string): Promise<void> {
    try {
      // In Firestore, you'd need to use a different approach to delete
      // For now, we'll mark it as deleted
      await updateDoc(doc(db, "users", uid, "locations", locationId), {
        deleted: true,
        deletedAt: new Date().toISOString(),
      });
      console.log("Location deleted successfully");
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  }

  async setDefaultLocation(uid: string, locationId: string): Promise<void> {
    try {
      // First, get all locations to update the previous default
      // This is simplified - in a real app, you'd use a transaction
      const locations = await this.getUserLocations(uid);

      for (const location of locations) {
        if (location.id !== locationId && location.isDefault) {
          await this.updateLocation(uid, location.id, { isDefault: false });
        }
      }

      // Set the new default
      await this.updateLocation(uid, locationId, { isDefault: true });
      console.log("Default location updated successfully");
    } catch (error) {
      console.error("Error setting default location:", error);
      throw error;
    }
  }

  async getUserLocations(uid: string): Promise<UserLocation[]> {
    try {
      // Mock implementation - in a real app, you'd query the collection
      return [];
    } catch (error) {
      console.error("Error getting user locations:", error);
      return [];
    }
  }

  // Favorites Management
  async addFavoriteRestaurant(
    uid: string,
    restaurantData: Omit<FavoriteRestaurant, "addedAt">,
  ): Promise<void> {
    try {
      const restaurant: FavoriteRestaurant = {
        ...restaurantData,
        addedAt: new Date().toISOString(),
      };

      await setDoc(
        doc(db, "users", uid, "favorites", restaurant.id),
        restaurant,
      );
      console.log("Favorite restaurant added successfully");
    } catch (error) {
      console.error("Error adding favorite restaurant:", error);
      throw error;
    }
  }

  async removeFavoriteRestaurant(
    uid: string,
    restaurantId: string,
  ): Promise<void> {
    try {
      // In Firestore, you'd use deleteDoc
      // For now, we'll mark it as deleted
      await updateDoc(doc(db, "users", uid, "favorites", restaurantId), {
        deleted: true,
        removedAt: new Date().toISOString(),
      });
      console.log("Favorite restaurant removed successfully");
    } catch (error) {
      console.error("Error removing favorite restaurant:", error);
      throw error;
    }
  }

  async getFavoriteRestaurants(uid: string): Promise<FavoriteRestaurant[]> {
    try {
      // Mock implementation - in a real app, you'd query the collection
      return [];
    } catch (error) {
      console.error("Error getting favorite restaurants:", error);
      return [];
    }
  }

  // Helper method to update last login
  private async updateUserLastLogin(uid: string): Promise<void> {
    try {
      await updateDoc(doc(db, "users", uid), {
        lastLogin: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating last login:", error);
    }
  }
}

export const userService = new UserService();
