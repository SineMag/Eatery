import LayoutWrapper from "@/components/layout-wrapper";
import { SearchBar } from "@/components/search-bar";
import { Snackbar } from "@/components/snackbar";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SFSymbol = string;

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // User data states
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<any[]>([]);
  const [mostVisitedRestaurants, setMostVisitedRestaurants] = useState<any[]>(
    [],
  );

  // Get personalized greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Load profile image and user data
  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    }

    // Load user data when logged in
    if (user) {
      loadUserData();
    }
  }, [user]);

  // Mock function to load user data (in real app, this would come from Firestore)
  const loadUserData = () => {
    // Mock recent orders
    setRecentOrders([
      {
        id: "ORD-12345678",
        date: "2024-01-25",
        total: 285,
        status: "completed",
        restaurant: "The Grill House",
        items: ["Grilled Chicken", "Caesar Salad", "Chocolate Cake"],
      },
      {
        id: "ORD-12345677",
        date: "2024-01-24",
        total: 156,
        status: "completed",
        restaurant: "Pasta Paradise",
        items: ["Beef Steak", "Fresh Orange Juice"],
      },
    ]);

    // Mock favorite restaurants
    setFavoriteRestaurants([
      {
        id: "1",
        name: "The Grill House",
        cuisine: "Steakhouse",
        rating: 4.5,
        image: require("../assets/images/Main-Images/download.jpg"),
      },
      {
        id: "2",
        name: "Pasta Paradise",
        cuisine: "Italian",
        rating: 4.2,
        image: require("../assets/images/Main-Images/download (1).jpg"),
      },
      {
        id: "3",
        name: "Sushi Master",
        cuisine: "Japanese",
        rating: 4.8,
        image: require("../assets/images/Main-Images/images.jpg"),
      },
    ]);

    // Mock most visited restaurants (based on order frequency)
    setMostVisitedRestaurants([
      {
        id: "1",
        name: "The Grill House",
        visitCount: 8,
        lastVisited: "2 days ago",
        cuisine: "Steakhouse",
        rating: 4.5,
        image: require("../assets/images/Main-Images/download.jpg"),
      },
      {
        id: "2",
        name: "Burger Barn",
        visitCount: 5,
        lastVisited: "1 week ago",
        cuisine: "American",
        rating: 4.0,
        image: require("../assets/images/Burger-Images/images.jpg"),
      },
      {
        id: "3",
        name: "Taco Tuesday",
        visitCount: 3,
        lastVisited: "2 weeks ago",
        cuisine: "Mexican",
        rating: 4.3,
        image: require("../assets/images/Burger-Images/images (1).jpg"),
      },
    ]);
  };

  const handleSearch = async (query: string) => {
    setSearchLoading(true);
    setCurrentSearchQuery(query);

    try {
      // Mock search results for now
      const mockResults = [
        { name: "The Grill House", cuisine: "Steakhouse", rating: 4.5 },
        { name: "Pasta Paradise", cuisine: "Italian", rating: 4.3 },
      ];
      setSearchResults(mockResults);
      setSnackbarMessage(`Found ${mockResults.length} restaurants`);
      setShowSnackbar(true);
    } catch (error) {
      console.error("Error searching restaurants:", error);
      alert("Failed to search restaurants. Please try again.");
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
    <LayoutWrapper>
      {!user ? (
        // Landing screen for unauthenticated users
        <ScrollView
          style={styles.landingContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <Image
                source={require("../assets/images/Eatery Logo.png")}
                style={styles.heroLogo}
                resizeMode="contain"
              />
              <Text style={styles.heroTitle}>Welcome to Eatery</Text>
              <Text style={styles.heroSubtitle}>
                Delicious food delivered to your doorstep
              </Text>

              <View style={styles.authButtons}>
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={() => router.push("/auth/login")}
                >
                  <Text style={styles.signInButtonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => router.push("/auth/register")}
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Sneak Peek Section */}
          <View style={styles.sneakPeekSection}>
            <Text style={styles.sectionTitle}>What's Inside</Text>

            <View style={styles.previewGrid}>
              <TouchableOpacity
                style={styles.previewCard}
                onPress={() => router.push("/menu/mains")}
              >
                <Image
                  source={require("../public/Main -Menu.png")}
                  style={styles.previewImage}
                />
                <Text style={styles.previewTitle}>Delicious Mains</Text>
                <Text style={styles.previewDescription}>
                  Premium dishes crafted with care
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.previewCard}
                onPress={() => router.push("/menu/starters")}
              >
                <Image
                  source={require("../public/Starters - Menu.png")}
                  style={styles.previewImage}
                />
                <Text style={styles.previewTitle}>Tasty Starters</Text>
                <Text style={styles.previewDescription}>
                  Perfect appetizers to begin your meal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.previewCard}
                onPress={() => router.push("/menu/desserts")}
              >
                <Image
                  source={require("../public/Dessert - Menu.png")}
                  style={styles.previewImage}
                />
                <Text style={styles.previewTitle}>Sweet Desserts</Text>
                <Text style={styles.previewDescription}>
                  Indulgent treats to satisfy your cravings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.previewCard}
                onPress={() => router.push("/menu/beverages")}
              >
                <Image
                  source={require("../public/Beverages - Menu.png")}
                  style={styles.previewImage}
                />
                <Text style={styles.previewTitle}>Refreshing Beverages</Text>
                <Text style={styles.previewDescription}>
                  Cool drinks and hot beverages
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Why Choose Eatery</Text>

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={24}
                  color="#10b981"
                />
                <Text style={styles.featureText}>
                  Fast delivery to your location
                </Text>
              </View>

              <View style={styles.featureItem}>
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={24}
                  color="#10b981"
                />
                <Text style={styles.featureText}>
                  Fresh ingredients every time
                </Text>
              </View>

              <View style={styles.featureItem}>
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={24}
                  color="#10b981"
                />
                <Text style={styles.featureText}>Easy online ordering</Text>
              </View>

              <View style={styles.featureItem}>
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={24}
                  color="#10b981"
                />
                <Text style={styles.featureText}>Secure payment options</Text>
              </View>
            </View>
          </View>

          {/* Call to Action */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to get started?</Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push("/auth/register")}
            >
              <Text style={styles.ctaButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        // Regular content for authenticated users
        <ScrollView style={styles.content}>
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

          {/* Recent Orders - Only show if user has orders */}
          {user && recentOrders.length > 0 && (
            <View style={styles.userSection}>
              <View style={styles.userSectionHeader}>
                <Text style={styles.sectionTitle}>Recent Orders</Text>
                <TouchableOpacity onPress={() => router.push("/orders" as any)}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
              >
                {recentOrders.slice(0, 3).map((order) => (
                  <TouchableOpacity key={order.id} style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderRestaurant}>
                        {order.restaurant}
                      </Text>
                      <Text style={styles.orderDate}>{order.date}</Text>
                    </View>
                    <Text style={styles.orderItems}>
                      {order.items.slice(0, 2).join(", ")}
                    </Text>
                    <Text style={styles.orderTotal}>R{order.total}</Text>
                    <View
                      style={[
                        styles.orderStatus,
                        { backgroundColor: "#10b981" },
                      ]}
                    >
                      <Text style={styles.orderStatusText}>Delivered</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Favorite Restaurants - Only show if user has favorites */}
          {user && favoriteRestaurants.length > 0 && (
            <View style={styles.userSection}>
              <View style={styles.userSectionHeader}>
                <Text style={styles.sectionTitle}>Favorite Restaurants</Text>
                <TouchableOpacity
                  onPress={() => router.push("/favorites" as any)}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
              >
                {favoriteRestaurants.map((restaurant) => (
                  <TouchableOpacity
                    key={restaurant.id}
                    style={[styles.restaurantCard, { width: 140 }]}
                  >
                    <Image
                      source={restaurant.image}
                      style={[styles.restaurantImage, { height: 80 }]}
                    />
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <Text style={styles.restaurantCuisine}>
                      {restaurant.cuisine}
                    </Text>
                    <View style={styles.rating}>
                      <IconSymbol name="star.fill" size={12} color="#fbbf24" />
                      <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Most Visited Restaurants - Only show if user has visit history */}
          {user && mostVisitedRestaurants.length > 0 && (
            <View style={styles.userSection}>
              <View style={styles.userSectionHeader}>
                <Text style={styles.sectionTitle}>Most Visited</Text>
                <TouchableOpacity onPress={() => router.push("/")}>
                  <Text style={styles.seeAllText}>Explore More</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
              >
                {mostVisitedRestaurants.map((restaurant) => (
                  <TouchableOpacity
                    key={restaurant.id}
                    style={styles.restaurantCard}
                  >
                    <Image
                      source={restaurant.image}
                      style={styles.restaurantImage}
                    />
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <Text style={styles.restaurantCuisine}>
                      {restaurant.cuisine}
                    </Text>
                    <View style={styles.visitInfo}>
                      <Text style={styles.visitCount}>
                        {restaurant.visitCount} visits
                      </Text>
                      <Text style={styles.lastVisited}>
                        {restaurant.lastVisited}
                      </Text>
                    </View>
                    <View style={styles.rating}>
                      <IconSymbol name="star.fill" size={12} color="#fbbf24" />
                      <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <View style={styles.searchResultsSection}>
              <View style={styles.searchResultsHeader}>
                <Text
                  style={[
                    styles.searchResultsTitle,
                    dynamicStyles.sectionTitle,
                  ]}
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
                    style={[
                      styles.restaurantCard,
                      dynamicStyles.restaurantCard,
                    ]}
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
                        <IconSymbol
                          name="star.fill"
                          size={12}
                          color="#fbbf24"
                        />
                        <Text style={styles.ratingText}>
                          {restaurant.rating}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.searchLocation} numberOfLines={1}>
                      {restaurant.searchLocation}
                    </Text>
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
                onPress={() =>
                  router.push(`/menu/${category.name.toLowerCase()}`)
                }
              >
                <View style={styles.categoryImageContainer}>
                  <Image
                    source={getCategoryImage(category.name)}
                    style={styles.categoryImage}
                  />
                </View>
                <Text style={[styles.categoryName, dynamicStyles.categoryName]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      <Snackbar
        visible={showSnackbar}
        message={snackbarMessage}
        type="success"
        duration={1500}
        onHide={() => setShowSnackbar(false)}
      />
    </LayoutWrapper>
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
  landingContent: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: "#f8fafc",
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  heroContent: {
    alignItems: "center",
    maxWidth: 400,
  },
  heroLogo: {
    width: 200,
    height: 60,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#11181C",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  authButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  signInButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#11181C",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  signInButtonText: {
    color: "#11181C",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    flex: 1,
    backgroundColor: "#11181C",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sneakPeekSection: {
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  previewCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    // Web-compatible shadow
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    // Native shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
    padding: 12,
    paddingBottom: 4,
  },
  previewDescription: {
    fontSize: 12,
    color: "#6b7280",
    paddingHorizontal: 12,
    paddingBottom: 12,
    lineHeight: 16,
  },
  featuresSection: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: "#f8fafc",
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },
  ctaSection: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#11181C",
    textAlign: "center",
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: "#11181C",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 14,
    color: "#6b7280",
  },
  // Restaurant styles (still used for favorites and most visited)
  restaurantCard: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    // Web-compatible shadow
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    // Native shadow properties
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
    // Web-compatible shadow
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    // Native shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  // User data section styles
  userSection: {
    backgroundColor: "#fff",
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  userSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  horizontalScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  // Order card styles
  orderCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    width: 200,
  },
  orderHeader: {
    marginBottom: 8,
  },
  orderRestaurant: {
    fontSize: 14,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  orderItems: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 8,
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  orderStatusText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
  },
  // Additional restaurant card styles for user data
  visitInfo: {
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  visitCount: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "500",
  },
  lastVisited: {
    fontSize: 10,
    color: "#6b7280",
  },
});
