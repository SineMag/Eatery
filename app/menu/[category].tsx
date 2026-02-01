import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/hooks"; // Import useAuth with correct path
import { FoodItem } from "@/types"; // Import FoodItem interface
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react"; // Added useEffect
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../hooks/useCart";

// Function to get local image for food items
const getFoodItemImage = (itemName: string, categoryId: string) => {
  // Map specific food items to their images
  const itemImageMap: { [key: string]: any } = {
    // Main dishes
    "Grilled Chicken": require("../../assets/images/main-dish.jpg"),
    "Beef Steak": require("../../assets/images/main-dish2.jpg"),
    "Pasta Primavera": require("../../assets/images/main-dish3.jpg"),
    "Fish and Chips": require("../../assets/images/tacos.jpg"),
    "Chicken Burger": require("../../assets/images/burger.jpg"),
    "Classic Burger": require("../../assets/images/burger2.jpg"),
    "Cheese Burger": require("../../assets/images/burger3.jpg"),
    "Vegetable Curry": require("../../assets/images/main-dish.jpg"), // Using a generic main dish image

    // Starters
    "Spring Rolls": require("../../assets/images/starters.jpg"),
    "Garlic Bread": require("../../assets/images/starters2.jpg"),
    "Caesar Salad": require("../../assets/images/starters3.jpg"),
    "Soup of the Day": require("../../assets/images/starters4.jpg"),

    // Desserts
    "Chocolate Cake": require("../../assets/images/chocolate cake.jpg"),
    "Ice Cream": require("../../assets/images/ice cream with chocolate.jpg"),
    "Vanilla Cake": require("../../assets/images/vanilla cake.jpg"),
    "Carrot Cake": require("../../assets/images/carrot and ice cream cake.jpg"),
    "Assorted Cakes": require("../../assets/images/cakes.jpg"),
    "Cheesecake": require("../../assets/images/vanilla cake.jpg"), // Using a generic cake image

    // Beverages
    "Fresh Juice": require("../../assets/images/drink1.jpg"),
    "Soft Drink": require("../../assets/images/drink2.jpg"),
    Coffee: require("../../assets/images/drink3.jpg"),
    Tea: require("../../assets/images/drink4.jpg"),
    "Mixed Drinks": require("../../assets/images/drinks.jpg"),
    "Lemonade": require("../../assets/images/drink1.jpg"), // Using a generic drink image
  };

  // Return the mapped image or a default based on category
  return (
    itemImageMap[itemName] ||
    (() => {
      switch (categoryId) {
        case "mains":
          return require("../../assets/images/main-dish.jpg");
        case "starters":
          return require("../../assets/images/starters.jpg");
        case "desserts":
          return require("../../assets/images/chocolate cake.jpg");
        case "beverages":
          return require("../../assets/images/drink1.jpg");
        case "burgers":
          return require("../../assets/images/burger.jpg");
        case "alcohol":
          return require("../../assets/images/drinks.jpg");
        default:
          return require("../../assets/images/main-dish.jpg");
      }
    })()
  );
};

export default function MenuScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, getItemCount } = useCart();
  const { user } = useAuth();

  const categoryId = (params?.category as string)?.toLowerCase();
  const restaurantId = params?.restaurantId as string;

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      let itemsToDisplay: FoodItem[] = [];

      if (restaurantId) {
        itemsToDisplay = getMockFoodItems(null, restaurantId);
      } else if (categoryId) {
        itemsToDisplay = getMockFoodItems(categoryId);
      } else {
        setError("No menu items to display.");
      }

      setFoodItems(itemsToDisplay);
      setLoading(false);
    };

    fetchItems();
  }, [categoryId, restaurantId]);

  // Mock data function
  const getMockFoodItems = (
    category: string | null,
    restaurantId: string | null = null,
  ): FoodItem[] => {
    let allItems: FoodItem[] = [];

    // Combine all mock items for filtering
    const allMockItems = [
      ...getCategoryItems("mains"),
      ...getCategoryItems("starters"),
      ...getCategoryItems("desserts"),
      ...getCategoryItems("beverages"),
      ...getCategoryItems("burgers"),
      ...getCategoryItems("alcohol"),
    ];

    if (restaurantId) {
      // Filter by restaurantId first if provided
      allItems = allMockItems.filter((item) => item.restaurantId === restaurantId);
    } else if (category) {
      // Otherwise, filter by category
      allItems = getCategoryItems(category);
    }
    return allItems;
  };

  const getCategoryItems = (category: string): FoodItem[] => {
    switch (category) {
      case "mains":
        return [
          {
            id: "main1",
            name: "Grilled Chicken",
            description: "Tender grilled chicken breast with herbs and spices",
            price: 120,
            imageUrl: "",
            categoryId: "mains",
            restaurant: "The Grill House",
            distance: "2.5 km",
            deliveryTime: "30-40 min",
            restaurantId: "1", // Added restaurantId
          },
          {
            id: "main2",
            name: "Beef Steak",
            description: "Premium beef steak cooked to perfection",
            price: 180,
            imageUrl: "",
            categoryId: "mains",
            restaurant: "Steak Palace",
            distance: "3.0 km",
            deliveryTime: "35-45 min",
            restaurantId: "2", // Added restaurantId
          },
          {
            id: "main3",
            name: "Pasta Primavera",
            description: "Fresh pasta with seasonal vegetables",
            price: 95,
            imageUrl: "",
            categoryId: "mains",
            restaurant: "Pasta Paradise",
            distance: "2.0 km",
            deliveryTime: "25-35 min",
            restaurantId: "3", // Added restaurantId
          },
          {
            id: "main4",
            name: "Fish and Chips",
            description: "Crispy fried fish with golden chips",
            price: 85,
            imageUrl: "",
            categoryId: "mains",
            restaurant: "Seafood Express",
            distance: "4.0 km",
            deliveryTime: "40-50 min",
            restaurantId: "4", // Added restaurantId
          },
          {
            id: "main5",
            name: "Vegetable Curry",
            description: "A rich and spicy vegetable curry with rice",
            price: 110,
            imageUrl: "",
            categoryId: "mains",
            restaurant: "The Spice Route",
            distance: "3.5 km",
            deliveryTime: "45-55 min",
            restaurantId: "5",
          },
        ];
      case "starters":
        return [
          {
            id: "start1",
            name: "Spring Rolls",
            description: "Crispy vegetable spring rolls with sweet chili sauce",
            price: 45,
            imageUrl: "",
            categoryId: "starters",
            restaurant: "Asian Fusion",
            distance: "2.5 km",
            deliveryTime: "20-30 min",
            restaurantId: "1", // Added restaurantId
          },
          {
            id: "start2",
            name: "Garlic Bread",
            description: "Toasted garlic bread with herbs",
            price: 35,
            imageUrl: "",
            categoryId: "starters",
            restaurant: "Italian Bistro",
            distance: "1.5 km",
            deliveryTime: "15-25 min",
            restaurantId: "2", // Added restaurantId
          },
          {
            id: "start3",
            name: "Caesar Salad",
            description: "Fresh romaine lettuce with caesar dressing",
            price: 55,
            imageUrl: "",
            categoryId: "starters",
            restaurant: "Green Garden",
            distance: "2.0 km",
            deliveryTime: "20-30 min",
            restaurantId: "3", // Added restaurantId
          },
          {
            id: "start4",
            name: "Soup of the Day",
            description: "Daily special soup with fresh ingredients",
            price: 40,
            imageUrl: "",
            categoryId: "starters",
            restaurant: "Soup Kitchen",
            distance: "1.8 km",
            deliveryTime: "15-25 min",
            restaurantId: "4", // Added restaurantId
          },
        ];
      case "desserts":
        return [
          {
            id: "dess1",
            name: "Chocolate Cake",
            description: "Rich chocolate cake with ganache",
            price: 65,
            imageUrl: "",
            categoryId: "desserts",
            restaurant: "Sweet Dreams",
            distance: "2.2 km",
            deliveryTime: "25-35 min",
            restaurantId: "1", // Added restaurantId
          },
          {
            id: "dess2",
            name: "Ice Cream",
            description: "Creamy vanilla ice cream with toppings",
            price: 45,
            imageUrl: "",
            categoryId: "desserts",
            restaurant: "Ice Cream Parlour",
            distance: "1.5 km",
            deliveryTime: "15-25 min",
            restaurantId: "2", // Added restaurantId
          },
          {
            id: "dess3",
            name: "Vanilla Cake",
            description: "Light vanilla sponge with cream frosting",
            price: 55,
            imageUrl: "",
            categoryId: "desserts",
            restaurant: "Cake House",
            distance: "2.8 km",
            deliveryTime: "30-40 min",
            restaurantId: "3", // Added restaurantId
          },
          {
            id: "dess4",
            name: "Carrot Cake",
            description: "Moist carrot cake with cream cheese frosting",
            price: 60,
            imageUrl: "",
            categoryId: "desserts",
            restaurant: "Bakery Fresh",
            distance: "2.0 km",
            deliveryTime: "25-35 min",
            restaurantId: "4", // Added restaurantId
          },
          {
            id: "dess5",
            name: "Cheesecake",
            description: "Classic New York style cheesecake with berry topping",
            price: 70,
            imageUrl: "",
            categoryId: "desserts",
            restaurant: "Sweet Indulgence",
            distance: "2.5 km",
            deliveryTime: "30-40 min",
            restaurantId: "5",
          },
        ];
      case "beverages":
        return [
          {
            id: "bev1",
            name: "Fresh Juice",
            description: "Freshly squeezed orange juice",
            price: 25,
            imageUrl: "",
            categoryId: "beverages",
            restaurant: "Juice Bar",
            distance: "1.2 km",
            deliveryTime: "10-20 min",
            restaurantId: "1", // Added restaurantId
          },
          {
            id: "bev2",
            name: "Soft Drink",
            description: "Assorted soft drinks",
            price: 20,
            imageUrl: "",
            categoryId: "beverages",
            restaurant: "Drink Station",
            distance: "1.0 km",
            deliveryTime: "10-15 min",
            restaurantId: "2", // Added restaurantId
          },
          {
            id: "bev3",
            name: "Coffee",
            description: "Freshly brewed coffee",
            price: 30,
            imageUrl: "",
            categoryId: "beverages",
            restaurant: "Coffee Shop",
            distance: "0.8 km",
            deliveryTime: "5-15 min",
            restaurantId: "3", // Added restaurantId
          },
          {
            id: "bev4",
            name: "Tea",
            description: "Selection of premium teas",
            price: 25,
            imageUrl: "",
            categoryId: "beverages",
            restaurant: "Tea House",
            distance: "1.5 km",
            deliveryTime: "10-20 min",
            restaurantId: "4", // Added restaurantId
          },
          {
            id: "bev5",
            name: "Lemonade",
            description: "Freshly squeezed lemonade with mint",
            price: 30,
            imageUrl: "",
            categoryId: "beverages",
            restaurant: "Juice Bar",
            distance: "1.0 km",
            deliveryTime: "5-15 min",
            restaurantId: "1",
          },
        ];
      case "burgers":
        return [
          {
            id: "burg1",
            name: "Chicken Burger",
            description: "Crispy chicken burger with lettuce and tomato",
            price: 75,
            imageUrl: "",
            categoryId: "burgers",
            restaurant: "Burger Joint",
            distance: "2.0 km",
            deliveryTime: "25-35 min",
            restaurantId: "1", // Added restaurantId
          },
          {
            id: "burg2",
            name: "Classic Burger",
            description: "Classic beef burger with cheese",
            price: 85,
            imageUrl: "",
            categoryId: "burgers",
            restaurant: "Burger Palace",
            distance: "1.8 km",
            deliveryTime: "20-30 min",
            restaurantId: "2", // Added restaurantId
          },
          {
            id: "burg3",
            name: "Cheese Burger",
            description: "Double cheese burger with special sauce",
            price: 95,
            imageUrl: "",
            categoryId: "burgers",
            restaurant: "Cheese Burger Co",
            distance: "2.5 km",
            deliveryTime: "30-40 min",
            restaurantId: "3", // Added restaurantId
          },
        ];
      case "alcohol":
        return [
          {
            id: "alc1",
            name: "Beer",
            description: "Selection of local and imported beers",
            price: 35,
            imageUrl: "",
            categoryId: "alcohol",
            restaurant: "Pub & Grill",
            distance: "1.5 km",
            deliveryTime: "20-30 min",
            restaurantId: "1", // Added restaurantId
          },
          {
            id: "alc2",
            name: "Wine",
            description: "Red and white wine selection",
            price: 120,
            imageUrl: "",
            categoryId: "alcohol",
            restaurant: "Wine Bar",
            distance: "2.0 km",
            deliveryTime: "25-35 min",
            restaurantId: "2", // Added restaurantId
          },
        ];
      default:
        return [];
    }
  };

  const addToCart = (item: FoodItem) => {
    // Changed type from MenuItem to FoodItem
    if (!user) {
      Alert.alert(
        "Login Required",
        "Please sign in to add items to your cart",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign In",
            onPress: () => router.push("/auth/login"),
          },
        ],
      );
      return;
    }

    const cartItem = {
      id: item.id,
      foodItem: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        categoryId: item.categoryId,
        restaurant: item.restaurant,
        restaurantId: item.restaurantId,
        distance: item.distance,
        deliveryTime: item.deliveryTime,
      },
      quantity: 1,
    };

    addItem(cartItem);
    Alert.alert("Added to Cart", `${item.name} has been added to your cart!`);
  };

  const getCategoryTitle = () => {
    if (restaurantId) {
      // In a real app, you would fetch the restaurant name using restaurantId
      return "Restaurant Menu";
    }
    switch (
      categoryId // Changed to categoryId
    ) {
      case "mains":
        return "Main Courses";
      case "starters":
        return "Starters";
      case "desserts":
        return "Desserts";
      case "beverages":
        return "Beverages";
      case "burgers":
        return "Burgers";
      case "alcohol":
        return "Alcoholic Beverages";
      default:
        return "Menu";
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading menu items...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (foodItems.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>No items found for this category.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.title}>{getCategoryTitle()}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuGrid}>
          {foodItems.map(
            (
              item, // Changed from displayItems to foodItems
            ) => (
              <View key={item.id} style={styles.menuItem}>
                <Image
                  source={getFoodItemImage(item.name, categoryId)}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.restaurantName}>{item.restaurant}</Text>
                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.locationInfo}>
                    <IconSymbol name="location" size={14} color="#6b7280" />
                    <Text style={styles.distance}>{item.distance}</Text>
                    <Text style={styles.deliveryTime}>
                      {" "}
                      • {item.deliveryTime}
                    </Text>
                  </View>
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>R{item.price}</Text>
                    <TouchableOpacity
                      style={styles.addToCartButtonSmall}
                      onPress={() => addToCart(item)}
                    >
                      <IconSymbol name="plus" size={16} color="#fff" />
                      <Text style={styles.addToCartTextSmall}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ),
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContent: {
    // Added for loading/error states
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuGrid: {
    flexDirection: "column",
    gap: 16,
  },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: "#10b981",
  },
  itemImage: {
    width: "100%",
    height: 200,
  },
  itemInfo: {
    padding: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10b981",
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    lineHeight: 20,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  distance: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  deliveryTime: {
    fontSize: 12,
    color: "#10b981",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#11181C",
  },
  selectedBadge: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: 4,
  },
  footer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    padding: 16,
    paddingBottom: 32,
  },
  footerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectedCount: {
    fontSize: 14,
    color: "#6b7280",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#11181C",
  },
  addToCartButton: {
    backgroundColor: "#11181C",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  addToCartButtonSmall: {
    backgroundColor: "#11181C",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addToCartTextSmall: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cartIcon: {
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});
