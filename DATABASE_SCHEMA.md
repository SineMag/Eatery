# 📊 Database Schema - Complete Reference

## ✅ All Required Tables

### **Database Tables (7 total)**

1. **user_profiles** - User account information
2. **food_categories** - Food categories (Mains, Starters, etc.)
3. **restaurants** - Restaurant information
4. **food_items** - Menu items
5. **orders** - Customer orders
6. **order_items** - Items in each order
7. **staff_profiles** - Staff/admin accounts

### **Local Storage (NOT database tables)**

- **cart** - Stored in React Context + localStorage
- **menu** - Derived from food_items + food_categories

---

## 🚀 Setup Instructions

### **Step 1: Run the Complete Schema**

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Click **SQL Editor** → **New Query**
4. Copy and paste the entire content from: `scripts/complete-schema.sql`
5. Click **Run**

### **Step 2: Verify Tables Created**

In Supabase, go to **Table Editor** and verify you see:
- ✅ user_profiles
- ✅ food_categories
- ✅ restaurants
- ✅ food_items
- ✅ orders
- ✅ order_items
- ✅ staff_profiles

### **Step 3: Test Registration**

1. Go back to your app
2. Click **Register**
3. Fill in the form:
   - **Name**: John
   - **Surname**: Doe
   - **Email**: `john@example.com`
   - **Contact**: 0123456789
   - **Address**: 123 Main Street
   - **Password**: `Password123`
4. Click **Sign Up** ✅

---

## 📋 Table Details

### **1. user_profiles**
```
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → auth.users)
- name (VARCHAR)
- surname (VARCHAR)
- contact_number (VARCHAR)
- address (TEXT)
- profile_image (TEXT)
- role (VARCHAR) - 'user' or 'admin'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **2. food_categories**
```
- id (UUID, Primary Key)
- name (VARCHAR, UNIQUE)
- order_num (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **3. restaurants**
```
- id (UUID, Primary Key)
- name (VARCHAR, UNIQUE)
- description (TEXT)
- image_url (TEXT)
- rating (DECIMAL)
- address (TEXT)
- phone (VARCHAR)
- latitude (DECIMAL)
- longitude (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **4. food_items**
```
- id (UUID, Primary Key)
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- image_url (TEXT)
- category_id (UUID, Foreign Key → food_categories)
- restaurant_id (UUID, Foreign Key → restaurants)
- distance (VARCHAR)
- delivery_time (VARCHAR)
- sides (JSONB)
- drinks (JSONB)
- extras (JSONB)
- optional_ingredients (JSONB)
- is_available (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **5. orders**
```
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → auth.users)
- total (DECIMAL)
- status (VARCHAR) - 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
- delivery_address (TEXT)
- payment_method (VARCHAR) - 'card', 'eft', 'cash'
- payment_status (VARCHAR) - 'pending', 'completed', 'failed'
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **6. order_items**
```
- id (UUID, Primary Key)
- order_id (UUID, Foreign Key → orders)
- food_item_id (UUID, Foreign Key → food_items)
- quantity (INTEGER)
- subtotal (DECIMAL)
- selected_sides (JSONB)
- selected_drinks (JSONB)
- selected_extras (JSONB)
- selected_ingredients (JSONB)
- customizations (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **7. staff_profiles**
```
- id (UUID, Primary Key)
- staff_id (VARCHAR, UNIQUE) - Format: ID0001
- name (VARCHAR)
- password_hash (VARCHAR)
- active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🔒 Security Features

### **Row Level Security (RLS) Enabled**
- ✅ user_profiles - Users can only see/edit their own
- ✅ orders - Users can only see/edit their own
- ✅ order_items - Users can only see their order items

### **Public Read Access**
- ✅ food_items - Anyone can view
- ✅ food_categories - Anyone can view
- ✅ restaurants - Anyone can view

---

## 📈 Performance Indexes

Indexes created for fast queries:
- idx_user_profiles_user_id
- idx_orders_user_id
- idx_orders_status
- idx_order_items_order_id
- idx_food_items_category_id
- idx_food_items_restaurant_id
- idx_staff_profiles_staff_id

---

## 🧪 Sample Data Included

The schema includes sample data:
- **6 Restaurants**: KFC, McDonald's, Nandos, Pedros, Hungry Lion, Vida e Caffè
- **6 Food Categories**: Mains, Starters, Desserts, Beverages, Burgers, Alcohol
- **5 Food Items**: Grilled Chicken, Classic Burger, Spring Rolls, Chocolate Cake, Fresh Juice
- **1 Staff Account**: ID0001 / John Doe

---

## ✅ What's NOT a Database Table

### **Cart**
- Stored in React Context
- Persisted in localStorage
- No database table needed

### **Menu**
- Derived from food_items + food_categories
- No separate table needed
- Built dynamically from queries

---

## 🔧 Troubleshooting

### **If you get "table not found" error:**
1. Run the complete schema SQL again
2. Check that all tables appear in Table Editor
3. Refresh your app

### **If registration still fails:**
1. Check user_profiles table exists
2. Verify RLS policies are created
3. Check Supabase logs for errors

### **If you can't see food items:**
1. Verify food_items table has data
2. Check food_categories table has data
3. Verify restaurants table has data

---

## 📝 Next Steps

1. ✅ Run the complete schema SQL
2. ✅ Verify all tables exist
3. ✅ Test registration
4. ✅ Test login
5. ✅ Browse menu
6. ✅ Add to cart
7. ✅ Place order

---

**All tables are now properly configured and ready to use!** 🎉
