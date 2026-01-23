import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { SearchBar } from "@/components/search-bar";
import { Snackbar } from "@/components/snackbar";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/useAuth";
import { searchRestaurantsByLocation } from "@/utils/geocoding";
import {
  fetchNearbyRestaurants,
  formatDistance,
  getCuisineType,
  getRestaurantAddress,
} from "@/utils/openStreetMap";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { SFSymbol } from "expo-symbols";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
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
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Get personalized greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Load profile image from storage
  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    }
  }, [user]);

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
      fetchNearbyRestaurantsData(currentLocation.coords);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get your location. Please try again.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const fetchNearbyRestaurantsData = async (
    coords: Location.LocationCoords,
  ) => {
    try {
      const restaurants = await fetchNearbyRestaurants(
        coords.latitude,
        coords.longitude,
      );

      // Format data for UI
      const formattedRestaurants = restaurants.map((restaurant: any) => ({
        id: restaurant.id.toString(),
        name: restaurant.tags.name,
        distance: formatDistance(restaurant.distance),
        rating: 0, // OpenStreetMap doesn't provide ratings
        cuisine: getCuisineType(restaurant.tags),
        vicinity: getRestaurantAddress(restaurant.tags),
        opening_hours: restaurant.tags.opening_hours,
        phone: restaurant.tags.phone,
        website: restaurant.tags.website,
      }));

      setNearbyRestaurants(formattedRestaurants);
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error);
      // Fall back to mock data if API fails
      const mockRestaurants = [
        {
          id: "1",
          name: "McDonald's",
          distance: "0.5 km",
          rating: 0,
          cuisine: "Fast Food",
          vicinity: "123 Main St",
        },
        {
          id: "2",
          name: "KFC",
          distance: "0.8 km",
          rating: 0,
          cuisine: "Fast Food",
          vicinity: "456 Broad St",
        },
      ];
      setNearbyRestaurants(mockRestaurants);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchLoading(true);
    setCurrentSearchQuery(query);

    try {
      const restaurants = await searchRestaurantsByLocation(query);

      // Format search results
      const formattedResults = restaurants.map((restaurant: any) => ({
        id: restaurant.id.toString(),
        name: restaurant.tags.name,
        distance: formatDistance(restaurant.distance),
        rating: 0,
        cuisine: getCuisineType(restaurant.tags),
        vicinity: getRestaurantAddress(restaurant.tags),
        opening_hours: restaurant.tags.opening_hours,
        phone: restaurant.tags.phone,
        website: restaurant.tags.website,
        searchLocation: restaurant.searchLocation,
      }));

      setSearchResults(formattedResults);
      setSnackbarMessage(
        `Found ${formattedResults.length} restaurants in ${query}`,
      );
      setShowSnackbar(true);
    } catch (error) {
      console.error("Error searching restaurants:", error);
      Alert.alert(
        "Search Error",
        "Failed to search restaurants. Please try again.",
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setCurrentSearchQuery("");
  };

  const getCategoryImage = (categoryName: string) => {
    switch (categoryName) {
      case "Mains":
        return require("../public/Main -Menu.png");
      case "Starters":
        return require("../public/Starters - Menu.png");
      case "Desserts":
        return require("../public/Dessert - Menu.png");
      case "Beverages":
        return require("../public/Beverages - Menu.png");
      case "Alcohol":
        return require("../public/Alcohol -Menu.png");
      case "Burgers":
        return require("../public/Burger - Menu.png");
      default:
        return null;
    }
  };

  const categories: { id: string; name: string; icon: SFSymbol }[] = [
    { id: "1", name: "Mains", icon: "hand.point.up.left.fill" },
    { id: "2", name: "Starters", icon: "hand.thumbsup.fill" },
    { id: "3", name: "Desserts", icon: "hand.point.right.fill" },
    { id: "4", name: "Beverages", icon: "hand.wave.fill" },
    { id: "5", name: "Alcohol", icon: "hand.raised.fill" },
    { id: "6", name: "Burgers", icon: "hand.point.up.left" },
  ];

  // Get screen dimensions for responsive design
  const { width: screenWidth } = Dimensions.get("window");
  const isTablet = screenWidth >= 768;
  const isDesktop = screenWidth >= 1024;

  // Responsive values
  const responsive = {
    containerMaxWidth: isDesktop ? 1200 : isTablet ? 768 : screenWidth,
    cardWidth: isDesktop ? 240 : isTablet ? 200 : 160,
    cardHeight: isDesktop ? 280 : isTablet ? 240 : 200,
    fontSize: {
      title: isDesktop ? 24 : isTablet ? 22 : 20,
      section: isDesktop ? 20 : isTablet ? 18 : 16,
      card: isDesktop ? 17 : isTablet ? 16 : 15,
      text: isDesktop ? 15 : isTablet ? 14 : 13,
    },
    spacing: {
      large: isDesktop ? 24 : isTablet ? 20 : 16,
      medium: isDesktop ? 20 : isTablet ? 16 : 12,
      small: isDesktop ? 16 : isTablet ? 12 : 8,
    },
    categoryColumns: isDesktop ? 4 : isTablet ? 3 : 2,
  };

  // Dynamic styles
  const dynamicStyles = StyleSheet.create({
    container: {
      maxWidth: responsive.containerMaxWidth,
      alignSelf: "center",
      width: "100%",
    },
    sectionTitle: {
      fontSize: responsive.fontSize.section,
      margin: responsive.spacing.large,
      marginBottom: responsive.spacing.medium,
    },
    restaurantCard: {
      width: responsive.cardWidth,
      marginRight: responsive.spacing.small,
    },
    restaurantImage: {
      height: responsive.cardHeight * 0.4,
    },
    restaurantName: {
      fontSize: responsive.fontSize.card,
    },
    categoryCard: {
      width: `${100 / responsive.categoryColumns - 2}%`,
      maxWidth: responsive.cardWidth,
    },
    categoryName: {
      fontSize: responsive.fontSize.text,
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ScrollView style={styles.content}>
        <AppHeader
          showProfile={true}
          showCart={true}
          showLogo={true}
          customProfileImage={profileImage}
        />

        {/* Personalized Welcome Section */}
        {user && (
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              {getGreeting()}, {user.name}!
            </Text>
          </View>
        )}

        {/* Search Section */}
        <View style={styles.searchSection}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search restaurants in any city..."
            loading={searchLoading}
          />
        </View>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={styles.searchResultsSection}>
            <View style={styles.searchResultsHeader}>
              <Text
                style={[styles.searchResultsTitle, dynamicStyles.sectionTitle]}
              >
                Restaurants in {currentSearchQuery}
              </Text>
              <TouchableOpacity
                onPress={clearSearch}
                style={styles.clearSearchButton}
              >
                <IconSymbol name="xmark" size={16} color="#9ca3af" />
                <Text style={styles.clearSearchText}>Clear</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {searchResults.map((restaurant) => (
                <TouchableOpacity
                  key={restaurant.id}
                  style={[styles.restaurantCard, dynamicStyles.restaurantCard]}
                  onPress={() => router.push(`/menu/${restaurant.id}`)}
                >
                  <View
                    style={[
                      styles.restaurantImage,
                      dynamicStyles.restaurantImage,
                    ]}
                  >
                    <IconSymbol name="fork.knife" size={32} color="#fff" />
                  </View>
                  <Text
                    style={[
                      styles.restaurantName,
                      dynamicStyles.restaurantName,
                    ]}
                  >
                    {restaurant.name}
                  </Text>
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
                  <Text style={styles.searchLocation} numberOfLines={1}>
                    📍 {restaurant.searchLocation}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Location Section */}
        <View style={styles.locationSection}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
            Nearby Restaurants
          </Text>
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
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              Recommended Near You
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {nearbyRestaurants.map((restaurant) => (
                <TouchableOpacity
                  key={restaurant.id}
                  style={[styles.restaurantCard, dynamicStyles.restaurantCard]}
                  onPress={() => router.push(`/menu/${restaurant.id}`)}
                >
                  <View
                    style={[
                      styles.restaurantImage,
                      dynamicStyles.restaurantImage,
                    ]}
                  >
                    <IconSymbol name="fork.knife" size={32} color="#fff" />
                  </View>
                  <Text
                    style={[
                      styles.restaurantName,
                      dynamicStyles.restaurantName,
                    ]}
                  >
                    {restaurant.name}
                  </Text>
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
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Categories
        </Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, dynamicStyles.categoryCard]}
              onPress={() => router.push(`/menu/${category.id}`)}
            >
              <View style={styles.categoryImageContainer}>
                <Image
                  source={getCategoryImage(category.name)}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={[styles.categoryName, dynamicStyles.categoryName]}>
                {category.name}
              </Text>
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
  welcomeSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 4,
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
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
  categoryImageContainer: {
    width: "100%",
    height: "70%",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#11181C",
    textAlign: "center",
  },
  searchSection: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  searchResultsSection: {
    marginBottom: 16,
  },
  searchResultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  clearSearchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  clearSearchText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  searchLocation: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 4,
    marginHorizontal: 8,
    marginBottom: 8,
  },
});
