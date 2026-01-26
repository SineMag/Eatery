const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Path to your service account key

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const FOOD_ITEMS_COLLECTION = "foodItems";

const menuItemsData = [
  // Main Items
  {
    id: "main1",
    name: "Grilled Chicken Breast",
    description: "Tender grilled chicken breast with herbs and spices",
    price: 120,
    imageUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=MainDish1", // Placeholder
    categoryId: "mains",
    restaurant: "The Grill House",
    distance: "10min away",
    deliveryTime: "10min",
  },
  {
    id: "main2",
    name: "Beef Steak",
    description: "Premium beef steak cooked to perfection",
    price: 180,
    imageUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=MainDish2", // Placeholder
    categoryId: "mains",
    restaurant: "Steak Master",
    distance: "15min away",
    deliveryTime: "15min",
  },
  {
    id: "main3",
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with lemon butter sauce",
    price: 150,
    imageUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=MainDish3", // Placeholder
    categoryId: "mains",
    restaurant: "Fine Dining",
    distance: "20min away",
    deliveryTime: "20min",
  },
  // Starter Items
  {
    id: "starter1",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with parmesan and croutons",
    price: 45,
    imageUrl: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Starter1", // Placeholder
    categoryId: "starters",
    restaurant: "Green Garden",
    distance: "8min away",
    deliveryTime: "8min",
  },
  {
    id: "starter2",
    name: "Garlic Bread",
    description: "Toasted garlic bread with herbs and cheese",
    price: 35,
    imageUrl: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Starter2", // Placeholder
    categoryId: "starters",
    restaurant: "Italian Corner",
    distance: "10min away",
    deliveryTime: "10min",
  },
  {
    id: "starter3",
    name: "Bruschetta",
    description: "Toasted bread with tomatoes, basil, and mozzarella",
    price: 55,
    imageUrl: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Starter3", // Placeholder
    categoryId: "starters",
    restaurant: "Healthy Bites",
    distance: "12min away",
    deliveryTime: "12min",
  },
  {
    id: "starter4",
    name: "Soup of the Day",
    description: "Fresh homemade soup with seasonal ingredients",
    price: 50,
    imageUrl: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Starter4", // Placeholder
    categoryId: "starters",
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
    imageUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Dessert1", // Placeholder
    categoryId: "desserts",
    restaurant: "KFC (Small Street)",
    distance: "5min away",
    deliveryTime: "5min",
  },
  {
    id: "dessert2",
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee and mascarpone",
    price: 55,
    imageUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Dessert2", // Placeholder
    categoryId: "desserts",
    restaurant: "Sweet Treats",
    distance: "8min away",
    deliveryTime: "8min",
  },
  {
    id: "dessert3",
    name: "Ice Cream Sundae",
    description: "Vanilla ice cream with chocolate sauce and toppings",
    price: 35,
    imageUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Dessert3", // Placeholder
    categoryId: "desserts",
    restaurant: "KFC (Small Street)",
    distance: "5min away",
    deliveryTime: "5min",
  },
  {
    id: "dessert4",
    name: "Fruit Tart",
    description: "Fresh seasonal fruits on pastry cream",
    price: 40,
    imageUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Dessert4", // Placeholder
    categoryId: "desserts",
    restaurant: "Bakery House",
    distance: "10min away",
    deliveryTime: "10min",
  },
  {
    id: "dessert5",
    name: "Cheesecake",
    description: "New York style cheesecake with berry compote",
    price: 50,
    imageUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Dessert5", // Placeholder
    categoryId: "desserts",
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
    imageUrl: "https://via.placeholder.com/150/00FFFF/FFFFFF?text=Beverage1", // Placeholder
    categoryId: "beverages",
    restaurant: "Juice Bar",
    distance: "5min away",
    deliveryTime: "5min",
  },
  {
    id: "beverage2",
    name: "Cappuccino",
    description: "Espresso with steamed milk foam",
    price: 30,
    imageUrl: "https://via.placeholder.com/150/00FFFF/FFFFFF?text=Beverage2", // Placeholder
    categoryId: "beverages",
    restaurant: "Coffee House",
    distance: "6min away",
    deliveryTime: "6min",
  },
  {
    id: "beverage3",
    name: "Iced Coffee",
    description: "Cold coffee with milk and ice",
    price: 28,
    imageUrl: "https://via.placeholder.com/150/00FFFF/FFFFFF?text=Beverage3", // Placeholder
    categoryId: "beverages",
    restaurant: "Bean Town",
    distance: "10min away",
    deliveryTime: "10min",
  },
  {
    id: "beverage4",
    name: "Smoothie",
    description: "Mixed berry smoothie with yogurt",
    price: 35,
    imageUrl: "https://via.placeholder.com/150/00FFFF/FFFFFF?text=Beverage4", // Placeholder
    categoryId: "beverages",
    restaurant: "Fresh Squeezed",
    distance: "8min away",
    deliveryTime: "8min",
  },
  {
    id: "beverage5",
    name: "Lemonade",
    description: "Fresh lemonade with mint",
    price: 20,
    imageUrl: "https://via.placeholder.com/150/00FFFF/FFFFFF?text=Beverage5", // Placeholder
    categoryId: "beverages",
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
    imageUrl: "https://via.placeholder.com/150/FFFF00/000000?text=Burger1", // Placeholder
    categoryId: "burgers",
    restaurant: "Burger Barn",
    distance: "8min away",
    deliveryTime: "8min",
  },
  {
    id: "burger2",
    name: "Cheese Burger",
    description: "Classic burger with melted cheese",
    price: 95,
    imageUrl: "https://via.placeholder.com/150/FFFF00/000000?text=Burger2", // Placeholder
    categoryId: "burgers",
    restaurant: "Burger Palace",
    distance: "10min away",
    deliveryTime: "10min",
  },
  {
    id: "burger3",
    name: "Bacon Burger",
    description: "Beef patty with crispy bacon and cheese",
    price: 105,
    imageUrl: "https://via.placeholder.com/150/FFFF00/000000?text=Burger3", // Placeholder
    categoryId: "burgers",
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
    imageUrl: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=Alcohol1", // Placeholder
    categoryId: "alcohol",
    restaurant: "Wine Cellar",
    distance: "15min away",
    deliveryTime: "15min",
  },
  {
    id: "alcohol2",
    name: "White Wine",
    description: "Crisp white wine with citrus notes",
    price: 60,
    imageUrl: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=Alcohol2", // Placeholder
    categoryId: "alcohol",
    restaurant: "Wine Cellar",
    distance: "15min away",
    deliveryTime: "15min",
  },
  {
    id: "alcohol3",
    name: "Craft Beer",
    description: "Local craft beer selection",
    price: 45,
    imageUrl: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=Alcohol3", // Placeholder
    categoryId: "alcohol",
    restaurant: "Beer Garden",
    distance: "12min away",
    deliveryTime: "12min",
  },
];

async function populateFirestore() {
  console.log("Populating Firestore with menu items...");
  for (const item of menuItemsData) {
    try {
      // Use the 'id' from the data as the document ID
      const docRef = db.collection(FOOD_ITEMS_COLLECTION).doc(item.id);
      await docRef.set(item); // Use set to ensure consistent IDs and overwrite if exists
      console.log(`Added/Updated item: ${item.name} with ID: ${item.id}`);
    } catch (error) {
      console.error(`Error adding/updating item ${item.name}:`, error);
    }
  }
  console.log("Firestore population complete.");
}

populateFirestore()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
