import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FavoriteRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  address: string;
  phone: string;
  isFavorite: boolean;
}

export default function FavoritesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in a real app, this would come from Firestore
    const mockFavorites: FavoriteRestaurant[] = [
      {
        id: "1",
        name: "The Grill House",
        cuisine: "Steakhouse",
        rating: 4.5,
        address: "123 Main Street, Cape Town",
        phone: "+27 21 123 4567",
        isFavorite: true,
      },
      {
        id: "2",
        name: "Pasta Paradise",
        cuisine: "Italian",
        rating: 4.2,
        address: "456 Long Street, Cape Town",
        phone: "+27 21 234 5678",
        isFavorite: true,
      },
      {
        id: "3",
        name: "Sushi Master",
        cuisine: "Japanese",
        rating: 4.8,
        address: "789 Bree Street, Cape Town",
        phone: "+27 21 345 6789",
        isFavorite: true,
      },
      {
        id: "4",
        name: "Burger Barn",
        cuisine: "American",
        rating: 4.0,
        address: "321 Kloof Street, Cape Town",
        phone: "+27 21 456 7890",
        isFavorite: true,
      },
      {
        id: "5",
        name: "Taco Tuesday",
        cuisine: "Mexican",
        rating: 4.3,
        address: "654 Church Street, Cape Town",
        phone: "+27 21 567 8901",
        isFavorite: true,
      },
    ];

    setTimeout(() => {
      setFavorites(mockFavorites);
      setLoading(false);
    }, 1000);
  }, []);

  const handleToggleFavorite = (restaurantId: string) => {
    Alert.alert(
      "Remove Favorite",
      "Are you sure you want to remove this restaurant from your favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setFavorites(favorites.filter((fav) => fav.id !== restaurantId));
            Alert.alert("Success", "Restaurant removed from favorites!");
          },
        },
      ],
    );
  };

  const handleOrderFromRestaurant = (restaurantId: string) => {
    // In a real app, this would navigate to the restaurant's menu
    Alert.alert("Coming Soon", "Restaurant menu will be available soon!");
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <IconSymbol
          key={`star-${i}`}
          name="star.fill"
          size={14}
          color="#fbbf24"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <IconSymbol
          key="half-star"
          name="star.leadinghalf.filled"
          size={14}
          color="#fbbf24"
        />,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <IconSymbol
          key={`empty-star-${i}`}
          name="star"
          size={14}
          color="#d1d5db"
        />,
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorite Restaurants</Text>
        <View style={{ width: 24 }} />
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="heart" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Add restaurants to your favorites to see them here
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.exploreButtonText}>Explore Restaurants</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.favoritesList}>
          {favorites.map((restaurant) => (
            <View key={restaurant.id} style={styles.restaurantCard}>
              <View style={styles.restaurantHeader}>
                <View style={styles.restaurantImage}>
                  <IconSymbol name="fork.knife" size={32} color="#fff" />
                </View>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => handleToggleFavorite(restaurant.id)}
                >
                  <IconSymbol name="heart.fill" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantCuisine}>
                  {restaurant.cuisine}
                </Text>

                <View style={styles.ratingContainer}>
                  <View style={styles.stars}>
                    {renderStars(restaurant.rating)}
                  </View>
                  <Text style={styles.ratingText}>{restaurant.rating}</Text>
                </View>

                <View style={styles.contactInfo}>
                  <View style={styles.infoRow}>
                    <IconSymbol name="location" size={14} color="#6b7280" />
                    <Text style={styles.infoText} numberOfLines={1}>
                      {restaurant.address}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <IconSymbol name="phone" size={14} color="#6b7280" />
                    <Text style={styles.infoText}>{restaurant.phone}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.orderButton}
                  onPress={() => handleOrderFromRestaurant(restaurant.id)}
                >
                  <Text style={styles.orderButtonText}>Order Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#11181C",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#11181C",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: "#11181C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  favoritesList: {
    padding: 16,
  },
  restaurantCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    paddingBottom: 8,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    backgroundColor: "#11181C",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  restaurantInfo: {
    padding: 16,
    paddingTop: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stars: {
    flexDirection: "row",
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  contactInfo: {
    marginBottom: 16,
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
  },
  orderButton: {
    backgroundColor: "#11181C",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
