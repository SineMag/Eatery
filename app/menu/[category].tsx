import { IconSymbol } from "@/components/ui/icon-symbol";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: any;
  category: string;
  restaurant: string;
  distance: string;
  deliveryTime: string;
}

export default function MenuScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { addItem, getItemCount } = useCart();

  // Get category from route params
  const category = (params?.category as string) || "mains";

  // Debug logging
  console.log("Menu Screen - Category from params:", category);
  console.log("Menu Screen - Params:", params);

  // Menu items data - in a real app, this would come from an API
  const menuItems: MenuItem[] = [
    // Main Items
    {
      id: "main1",
      name: "Grilled Chicken Breast",
      description: "Tender grilled chicken breast with herbs and spices",
      price: 120,
      image: require("../../assets/images/Main-Images/download.jpg"),
      category: "Mains",
      restaurant: "The Grill House",
      distance: "10min away",
      deliveryTime: "10min",
    },
    {
      id: "main2",
      name: "Beef Steak",
      description: "Premium beef steak cooked to perfection",
      price: 180,
      image: require("../../assets/images/Main-Images/download (1).jpg"),
      category: "Mains",
      restaurant: "Steak Master",
      distance: "15min away",
      deliveryTime: "15min",
    },
    {
      id: "main3",
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with lemon butter sauce",
      price: 150,
      image: require("../../assets/images/Main-Images/images.jpg"),
      category: "Mains",
      restaurant: "Fine Dining",
      distance: "20min away",
      deliveryTime: "20min",
    },
    // Starter Items
    {
      id: "starter1",
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with caesar dressing and croutons",
      price: 65,
      image: require("../../assets/images/Starters-Images/download.jpg"),
      category: "Starters",
      restaurant: "Asian Fusion",
      distance: "8min away",
      deliveryTime: "8min",
    },
    {
      id: "starter2",
      name: "Garlic Bread",
      description: "Toasted bread with garlic butter and herbs",
      price: 45,
      image: require("../../assets/images/Starters-Images/download (2).jpg"),
      category: "Starters",
      restaurant: "Italian Corner",
      distance: "10min away",
      deliveryTime: "10min",
    },
    {
      id: "starter3",
      name: "Bruschetta",
      description: "Toasted bread with tomatoes, basil, and mozzarella",
      price: 55,
      image: require("../../assets/images/Starters-Images/images.jpg"),
      category: "Starters",
      restaurant: "Healthy Bites",
      distance: "12min away",
      deliveryTime: "12min",
    },
    {
      id: "starter4",
      name: "Soup of the Day",
      description: "Fresh homemade soup with seasonal ingredients",
      price: 50,
      image: require("../../assets/images/Starters-Images/images (1).jpg"),
      category: "Starters",
      restaurant: "Soup Kitchen",
      distance: "7min away",
      deliveryTime: "7min",
    },
    // Dessert Items
    {
      id: "dessert1",
      name: "Chocolate Cake",
      description: "Rich chocolate cake with ganache frosting",
      price: 45,
      image: require("../../assets/images/Dessert-Images/chocolate cake.jpg"),
      category: "Desserts",
      restaurant: "KFC (Small Street)",
      distance: "5min away",
      deliveryTime: "5min",
    },
    {
      id: "dessert2",
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee and mascarpone",
      price: 55,
      image: require("../../assets/images/Dessert-Images/cakes.jpg"),
      category: "Desserts",
      restaurant: "Sweet Treats",
      distance: "8min away",
      deliveryTime: "8min",
    },
    {
      id: "dessert3",
      name: "Ice Cream Sundae",
      description: "Vanilla ice cream with chocolate sauce and toppings",
      price: 35,
      image: require("../../assets/images/Dessert-Images/ice cream with chocolate.jpg"),
      category: "Desserts",
      restaurant: "KFC (Small Street)",
      distance: "5min away",
      deliveryTime: "5min",
    },
    {
      id: "dessert4",
      name: "Fruit Tart",
      description: "Fresh seasonal fruits on pastry cream",
      price: 40,
      image: require("../../assets/images/Dessert-Images/carrot and ice cream cake.jpg"),
      category: "Desserts",
      restaurant: "Bakery House",
      distance: "10min away",
      deliveryTime: "10min",
    },
    {
      id: "dessert5",
      name: "Cheesecake",
      description: "New York style cheesecake with berry compote",
      price: 50,
      image: require("../../assets/images/Dessert-Images/vanilla cake.jpg"),
      category: "Desserts",
      restaurant: "Cake Palace",
      distance: "12min away",
      deliveryTime: "12min",
    },
    // Beverage Items
    {
      id: "beverage1",
      name: "Fresh Orange Juice",
      description: "Freshly squeezed orange juice",
      price: 25,
      image: require("../../assets/images/Beverage-Images/juice 100%.jpg"),
      category: "Beverages",
      restaurant: "Juice Bar",
      distance: "5min away",
      deliveryTime: "5min",
    },
    {
      id: "beverage2",
      name: "Cappuccino",
      description: "Espresso with steamed milk foam",
      price: 30,
      image: require("../../assets/images/Beverage-Images/coffee.jpg"),
      category: "Beverages",
      restaurant: "Coffee House",
      distance: "6min away",
      deliveryTime: "6min",
    },
    {
      id: "beverage3",
      name: "Iced Coffee",
      description: "Cold coffee with milk and ice",
      price: 28,
      image: require("../../assets/images/Beverage-Images/iced cappucino.jpg"),
      category: "Beverages",
      restaurant: "Bean Town",
      distance: "10min away",
      deliveryTime: "10min",
    },
    {
      id: "beverage4",
      name: "Smoothie",
      description: "Mixed berry smoothie with yogurt",
      price: 35,
      image: require("../../assets/images/Beverage-Images/juice.jpg"),
      category: "Beverages",
      restaurant: "Fresh Squeezed",
      distance: "8min away",
      deliveryTime: "8min",
    },
    {
      id: "beverage5",
      name: "Lemonade",
      description: "Fresh lemonade with mint",
      price: 20,
      image: require("../../assets/images/Beverage-Images/drinks.jpg"),
      category: "Beverages",
      restaurant: "Drink Station",
      distance: "12min away",
      deliveryTime: "12min",
    },
    // Burger Items
    {
      id: "burger1",
      name: "Classic Burger",
      description: "Beef patty with lettuce, tomato, and onion",
      price: 85,
      image: require("../../assets/images/Burger-Images/images.jpg"),
      category: "Burgers",
      restaurant: "Burger Barn",
      distance: "8min away",
      deliveryTime: "8min",
    },
    {
      id: "burger2",
      name: "Cheese Burger",
      description: "Classic burger with melted cheese",
      price: 95,
      image: require("../../assets/images/Burger-Images/images (1).jpg"),
      category: "Burgers",
      restaurant: "Burger Palace",
      distance: "10min away",
      deliveryTime: "10min",
    },
    {
      id: "burger3",
      name: "Bacon Burger",
      description: "Beef patty with crispy bacon and cheese",
      price: 105,
      image: require("../../assets/images/Burger-Images/images (2).jpg"),
      category: "Burgers",
      restaurant: "Burger King",
      distance: "12min away",
      deliveryTime: "12min",
    },
    // Alcohol Items
    {
      id: "alcohol1",
      name: "Red Wine",
      description: "Smooth red wine with rich flavors",
      price: 65,
      image: require("../../assets/images/Main-Images/download.jpg"),
      category: "Alcohol",
      restaurant: "Wine Cellar",
      distance: "15min away",
      deliveryTime: "15min",
    },
    {
      id: "alcohol2",
      name: "White Wine",
      description: "Crisp white wine with citrus notes",
      price: 60,
      image: require("../../assets/images/Main-Images/download (1).jpg"),
      category: "Alcohol",
      restaurant: "Wine Cellar",
      distance: "15min away",
      deliveryTime: "15min",
    },
    {
      id: "alcohol3",
      name: "Craft Beer",
      description: "Local craft beer selection",
      price: 45,
      image: require("../../assets/images/Main-Images/images.jpg"),
      category: "Alcohol",
      restaurant: "Beer Garden",
      distance: "12min away",
      deliveryTime: "12min",
    },
  ];

  // Filter items by category (case-insensitive)
  const filteredItems = menuItems.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase(),
  );

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const addToCart = (item: MenuItem) => {
    const cartItem = {
      id: item.id,
      foodItem: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.image,
        categoryId: category,
      },
      quantity: 1,
    };

    addItem(cartItem);
    Alert.alert("Added to Cart", `${item.name} has been added to your cart!`);
  };

  const getCategoryTitle = () => {
    switch (category) {
      case "Mains":
        return "Main Courses";
      case "Starters":
        return "Starters";
      case "Desserts":
        return "Desserts";
      case "Beverages":
        return "Beverages";
      case "Burgers":
        return "Burgers";
      case "Alcohol":
        return "Alcoholic Beverages";
      default:
        return "Menu";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#11181C" />
        </TouchableOpacity>
        <Text style={styles.title}>{getCategoryTitle()}</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
          <View style={styles.cartIcon}>
            <IconSymbol name="bag.fill" size={24} color="#11181C" />
            {getItemCount() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getItemCount()}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuGrid}>
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <Image
                source={item.image}
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
          ))}
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
