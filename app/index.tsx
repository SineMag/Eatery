import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Snackbar } from "@/components/snackbar";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { SFSymbol } from "expo-symbols";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [nearbyRestaurants, setNearbyRestaurants] = useState<any[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    setLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Permission to access location was denied. Please enable location to see nearby restaurants.",
          [{ text: "OK" }],
        );
        setLoadingLocation(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setSnackbarMessage("Location found! Showing restaurants near you");
      setShowSnackbar(true);
      fetchNearbyRestaurants(currentLocation.coords);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get your location. Please try again.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const fetchNearbyRestaurants = async (coords: Location.LocationCoords) => {
    // Mock nearby restaurants data
    const mockRestaurants = [
      {
        id: 1,
        name: "Burger Palace",
        distance: "0.5 km",
        rating: 4.5,
        cuisine: "American",
      },
      {
        id: 2,
        name: "Pasta Heaven",
        distance: "0.8 km",
        rating: 4.7,
        cuisine: "Italian",
      },
      {
        id: 3,
        name: "Sushi Express",
        distance: "1.2 km",
        rating: 4.8,
        cuisine: "Japanese",
      },
      {
        id: 4,
        name: "Taco Fiesta",
        distance: "1.5 km",
        rating: 4.3,
        cuisine: "Mexican",
      },
      {
        id: 5,
        name: "Curry House",
        distance: "2.0 km",
        rating: 4.6,
        cuisine: "Indian",
      },
    ];
    setNearbyRestaurants(mockRestaurants);
  };

  const categories: { id: string; name: string; icon: SFSymbol }[] = [
    { id: "1", name: "Mains", icon: "hand.point.up.left.fill" },
    { id: "2", name: "Starters", icon: "hand.thumbsup.fill" },
    { id: "3", name: "Desserts", icon: "hand.point.right.fill" },
    { id: "4", name: "Beverages", icon: "hand.wave.fill" },
    { id: "5", name: "Alcohol", icon: "hand.raised.fill" },
    { id: "6", name: "Burgers", icon: "hand.point.up.left" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <AppHeader showProfile={true} showCart={true} showLogo={true} />

        {/* Location Section */}
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
          {loadingLocation ? (
            <View style={styles.loadingContainer}>
              <IconSymbol name="location" size={24} color="#9ca3af" />
              <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
          ) : location ? null : (
            <TouchableOpacity
              style={styles.enableLocationButton}
              onPress={requestLocationPermission}
            >
              <IconSymbol name="location" size={20} color="#fff" />
              <Text style={styles.enableLocationText}>Enable Location</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Nearby Restaurants */}
        {nearbyRestaurants.length > 0 && (
          <View style={styles.nearbySection}>
            <Text style={styles.sectionTitle}>Recommended Near You</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {nearbyRestaurants.map((restaurant) => (
                <TouchableOpacity
                  key={restaurant.id}
                  style={styles.restaurantCard}
                  onPress={() => router.push(`/menu/${restaurant.id}`)}
                >
                  <View style={styles.restaurantImage}>
                    <IconSymbol name="fork.knife" size={32} color="#fff" />
                  </View>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.restaurantCuisine}>
                    {restaurant.cuisine}
                  </Text>
                  <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantDistance}>
                      {restaurant.distance}
                    </Text>
                    <View style={styles.rating}>
                      <IconSymbol name="star.fill" size={12} color="#fbbf24" />
                      <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Categories Section */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => router.push(`/menu/${category.id}`)}
            >
              <IconSymbol
                name={category.icon}
                size={32}
                color={Colors.light.text}
              />
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNavigation activeTab="home" />
      <Snackbar
        visible={showSnackbar}
        message={snackbarMessage}
        type="success"
        duration={1500}
        onHide={() => setShowSnackbar(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    maxWidth: "100%",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    paddingBottom: 80, // Account for bottom navigation
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    margin: 16,
    marginBottom: 12,
  },
  locationSection: {
    margin: 16,
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: "#6b7280",
    fontSize: 14,
  },
  enableLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#11181C",
    borderRadius: 8,
  },
  enableLocationText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  nearbySection: {
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingLeft: 16,
  },
  restaurantCard: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImage: {
    height: 80,
    backgroundColor: "#11181C",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
    marginHorizontal: 8,
  },
  restaurantCuisine: {
    fontSize: 12,
    color: "#6b7280",
    marginHorizontal: 8,
    marginBottom: 8,
  },
  restaurantInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  restaurantDistance: {
    fontSize: 12,
    color: "#6b7280",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    margin: "1%",
    maxWidth: 180,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#11181C",
    marginTop: 6,
    textAlign: "center",
  },
});
