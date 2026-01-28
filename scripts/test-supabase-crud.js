// Test Supabase CRUD Operations
// Run with: node scripts/test-supabase-crud.js

require("dotenv").config({ path: ".env" });

const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  console.log(
    "Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("🚀 Testing Supabase CRUD Operations...\n");

// Test data
const testFoodCategory = {
  name: "Test Category",
  description: "Test category for CRUD operations",
  image_url: "https://example.com/test.jpg",
};

const testFoodItem = {
  name: "Test Food Item",
  description: "Test food item for CRUD operations",
  price: 9.99,
  category_id: null, // Will be set after creating category
  image_url: "https://example.com/food.jpg",
  available: true,
};

const testRestaurant = {
  name: "Test Restaurant",
  description: "Test restaurant for CRUD operations",
  address: "123 Test St",
  city: "Test City",
  phone: "+1234567890",
  email: "test@example.com",
  image_url: "https://example.com/restaurant.jpg",
};

let categoryId = null;
let foodItemId = null;
let restaurantId = null;

// Helper function to log results
function logResult(operation, success, data = null, error = null) {
  if (success) {
    console.log(`✅ ${operation}: SUCCESS`);
    if (data) console.log("   Data:", JSON.stringify(data, null, 2));
  } else {
    console.log(`❌ ${operation}: FAILED`);
    if (error) console.log("   Error:", error.message);
  }
  console.log("");
}

// Test Functions
async function testCreateFoodCategory() {
  console.log("📝 Creating Food Category...");
  try {
    const { data, error } = await supabase
      .from("food_categories")
      .insert(testFoodCategory)
      .select()
      .single();

    if (error) throw error;

    categoryId = data.id;
    testFoodItem.category_id = categoryId;
    logResult("Create Food Category", true, data);
    return data;
  } catch (error) {
    logResult("Create Food Category", false, null, error);
    return null;
  }
}

async function testReadFoodCategories() {
  console.log("📖 Reading Food Categories...");
  try {
    const { data, error } = await supabase.from("food_categories").select("*");

    if (error) throw error;

    logResult("Read Food Categories", true, data);
    return data;
  } catch (error) {
    logResult("Read Food Categories", false, null, error);
    return null;
  }
}

async function testUpdateFoodCategory() {
  if (!categoryId) {
    logResult("Update Food Category", false, null, {
      message: "No category ID available",
    });
    return null;
  }

  console.log("✏️ Updating Food Category...");
  try {
    const { data, error } = await supabase
      .from("food_categories")
      .update({
        name: "Updated Test Category",
        description: "Updated description",
      })
      .eq("id", categoryId)
      .select()
      .single();

    if (error) throw error;

    logResult("Update Food Category", true, data);
    return data;
  } catch (error) {
    logResult("Update Food Category", false, null, error);
    return null;
  }
}

async function testCreateFoodItem() {
  console.log("📝 Creating Food Item...");
  try {
    const { data, error } = await supabase
      .from("food_items")
      .insert(testFoodItem)
      .select()
      .single();

    if (error) throw error;

    foodItemId = data.id;
    logResult("Create Food Item", true, data);
    return data;
  } catch (error) {
    logResult("Create Food Item", false, null, error);
    return null;
  }
}

async function testReadFoodItems() {
  console.log("📖 Reading Food Items...");
  try {
    const { data, error } = await supabase.from("food_items").select(`
        *,
        food_categories (
          name,
          description
        )
      `);

    if (error) throw error;

    logResult("Read Food Items (with categories)", true, data);
    return data;
  } catch (error) {
    logResult("Read Food Items", false, null, error);
    return null;
  }
}

async function testCreateRestaurant() {
  console.log("📝 Creating Restaurant...");
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .insert(testRestaurant)
      .select()
      .single();

    if (error) throw error;

    restaurantId = data.id;
    logResult("Create Restaurant", true, data);
    return data;
  } catch (error) {
    logResult("Create Restaurant", false, null, error);
    return null;
  }
}

async function testDeleteFoodItem() {
  if (!foodItemId) {
    logResult("Delete Food Item", false, null, {
      message: "No food item ID available",
    });
    return null;
  }

  console.log("🗑️ Deleting Food Item...");
  try {
    const { data, error } = await supabase
      .from("food_items")
      .delete()
      .eq("id", foodItemId)
      .select();

    if (error) throw error;

    logResult("Delete Food Item", true, data);
    return data;
  } catch (error) {
    logResult("Delete Food Item", false, null, error);
    return null;
  }
}

async function testDeleteFoodCategory() {
  if (!categoryId) {
    logResult("Delete Food Category", false, null, {
      message: "No category ID available",
    });
    return null;
  }

  console.log("🗑️ Deleting Food Category...");
  try {
    const { data, error } = await supabase
      .from("food_categories")
      .delete()
      .eq("id", categoryId)
      .select();

    if (error) throw error;

    logResult("Delete Food Category", true, data);
    return data;
  } catch (error) {
    logResult("Delete Food Category", false, null, error);
    return null;
  }
}

async function testDeleteRestaurant() {
  if (!restaurantId) {
    logResult("Delete Restaurant", false, null, {
      message: "No restaurant ID available",
    });
    return null;
  }

  console.log("🗑️ Deleting Restaurant...");
  try {
    const { data, error } = await supabase
      .from("restaurants")
      .delete()
      .eq("id", restaurantId)
      .select();

    if (error) throw error;

    logResult("Delete Restaurant", true, data);
    return data;
  } catch (error) {
    logResult("Delete Restaurant", false, null, error);
    return null;
  }
}

// Test Database Connection
async function testConnection() {
  console.log("🔗 Testing Database Connection...");
  try {
    const { data, error } = await supabase
      .from("food_categories")
      .select("count")
      .single();

    if (error) throw error;

    logResult("Database Connection", true, data);
    return true;
  } catch (error) {
    logResult("Database Connection", false, null, error);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log("🔧 Environment Check:");
  console.log(`   Supabase URL: ${supabaseUrl ? "✅ Set" : "❌ Missing"}`);
  console.log(`   Supabase Key: ${supabaseKey ? "✅ Set" : "❌ Missing"}`);
  console.log("");

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.log("❌ Cannot proceed with tests - database connection failed");
    return;
  }

  // Run CRUD tests in sequence
  await testCreateFoodCategory();
  await testReadFoodCategories();
  await testUpdateFoodCategory();
  await testCreateFoodItem();
  await testReadFoodItems();
  await testCreateRestaurant();

  // Cleanup
  await testDeleteFoodItem();
  await testDeleteFoodCategory();
  await testDeleteRestaurant();

  console.log("🏁 CRUD Tests Complete!");
  console.log("");
  console.log("💡 Next Steps:");
  console.log("   1. Check your Supabase dashboard to verify the test data");
  console.log("   2. Test with your actual app authentication");
  console.log("   3. Verify RLS policies are working correctly");
}

// Run the tests
runTests().catch(console.error);
