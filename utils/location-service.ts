import { Platform } from "react-native";

// For web, we'll use browser geolocation
// For mobile, we'll use Expo Location

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  address: string;
  phone: string;
  image: string;
  distance?: number;
  location: {
    latitude: number;
    longitude: number;
  };
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
}

class LocationService {
  private currentLocation: Location | null = null;

  async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === "web") {
      // Web browsers will prompt automatically
      return true;
    }

    try {
      // For mobile, you would use Expo Location here
      // For now, return true to proceed
      return true;
    } catch (error) {
      console.error("Location permission error:", error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<Location | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error("Location permission denied");
      }

      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by this browser"));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location: Location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude || undefined,
              altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
              heading: position.coords.heading || undefined,
              speed: position.coords.speed || undefined,
            };
            this.currentLocation = location;
            resolve(location);
          },
          (error) => {
            console.error("Geolocation error:", error);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          },
        );
      });
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async getNearbyRestaurants(userLocation?: Location): Promise<Restaurant[]> {
    try {
      const location = userLocation || (await this.getCurrentLocation());

      if (!location) {
        // Return all restaurants if location is not available
        return this.getAllRestaurants();
      }

      const allRestaurants = this.getAllRestaurants();

      // Calculate distance for each restaurant
      const restaurantsWithDistance = allRestaurants.map((restaurant) => ({
        ...restaurant,
        distance: this.calculateDistance(
          location.latitude,
          location.longitude,
          restaurant.location.latitude,
          restaurant.location.longitude,
        ),
      }));

      // Sort by distance and return nearby ones (within 20km)
      return restaurantsWithDistance
        .filter((restaurant) => restaurant.distance! <= 20)
        .sort((a, b) => a.distance! - b.distance!);
    } catch (error) {
      console.error("Error getting nearby restaurants:", error);
      return this.getAllRestaurants();
    }
  }

  private getAllRestaurants(): Restaurant[] {
    // Mock restaurant data - in a real app, this would come from an API
    return [
      {
        id: "1",
        name: "The Grill House",
        cuisine: "Steakhouse",
        rating: 4.5,
        address: "123 Main St, Johannesburg",
        phone: "+27 11 123 4567",
        image:
          "https://via.placeholder.com/200x120/8B4513/FFFFFF?text=Grill+House",
        location: { latitude: -26.2041, longitude: 28.0473 },
        deliveryTime: "30-45 min",
        deliveryFee: 25,
        minimumOrder: 100,
      },
      {
        id: "2",
        name: "Pasta Paradise",
        cuisine: "Italian",
        rating: 4.3,
        address: "456 Oak Ave, Cape Town",
        phone: "+27 21 234 5678",
        image:
          "https://via.placeholder.com/200x120/FF6B6B/FFFFFF?text=Pasta+Paradise",
        location: { latitude: -33.9249, longitude: 18.4241 },
        deliveryTime: "25-40 min",
        deliveryFee: 20,
        minimumOrder: 80,
      },
      {
        id: "3",
        name: "Sushi Express",
        cuisine: "Japanese",
        rating: 4.7,
        address: "789 Beach Rd, Durban",
        phone: "+27 31 345 6789",
        image:
          "https://via.placeholder.com/200x120/4ECDC4/FFFFFF?text=Sushi+Express",
        location: { latitude: -29.8587, longitude: 31.0218 },
        deliveryTime: "20-35 min",
        deliveryFee: 30,
        minimumOrder: 120,
      },
      {
        id: "4",
        name: "Burger Barn",
        cuisine: "American",
        rating: 4.2,
        address: "321 Market St, Pretoria",
        phone: "+27 12 456 7890",
        image:
          "https://via.placeholder.com/200x120/FF8C42/FFFFFF?text=Burger+Barn",
        location: { latitude: -25.7479, longitude: 28.2293 },
        deliveryTime: "35-50 min",
        deliveryFee: 22,
        minimumOrder: 90,
      },
      {
        id: "5",
        name: "Curry Corner",
        cuisine: "Indian",
        rating: 4.6,
        address: "654 Spice Ln, Johannesburg",
        phone: "+27 11 567 8901",
        image:
          "https://via.placeholder.com/200x120/FFD93D/FFFFFF?text=Curry+Corner",
        location: { latitude: -26.1954, longitude: 28.0344 },
        deliveryTime: "30-45 min",
        deliveryFee: 25,
        minimumOrder: 100,
      },
      {
        id: "6",
        name: "Taco Town",
        cuisine: "Mexican",
        rating: 4.4,
        address: "987 Fiesta Blvd, Cape Town",
        phone: "+27 21 678 9012",
        image:
          "https://via.placeholder.com/200x120/6BCF7F/FFFFFF?text=Taco+Town",
        location: { latitude: -33.931, longitude: 18.4169 },
        deliveryTime: "25-40 min",
        deliveryFee: 20,
        minimumOrder: 85,
      },
    ];
  }

  getCurrentLocationSync(): Location | null {
    return this.currentLocation;
  }
}

export const locationService = new LocationService();
