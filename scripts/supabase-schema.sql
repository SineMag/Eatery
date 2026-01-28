-- Supabase Database Schema for Eatery App (Unified for Users and Staff)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================
-- Core Domain Tables
-- =============================

-- Food Categories Table
CREATE TABLE IF NOT EXISTS food_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    order_num INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    rating DECIMAL(3,2),
    address TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Food Items Table
CREATE TABLE IF NOT EXISTS food_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT NOT NULL,
    category_id UUID REFERENCES food_categories(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    distance TEXT,
    delivery_time TEXT,
    sides JSONB,
    drinks JSONB,
    extras JSONB,
    optional_ingredients JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    delivery_address TEXT NOT NULL,
    payment_method TEXT NOT NULL, -- one of: 'eft', 'cash', 'card', 'pickup_card'
    notes TEXT, -- optional customer notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES food_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal DECIMAL(10,2) NOT NULL,
    selected_sides JSONB,
    selected_drinks JSONB,
    selected_extras JSONB,
    selected_ingredients JSONB,
    customizations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles Table (Customers)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    surname TEXT,
    contact_number TEXT,
    address TEXT,
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =============================
-- Staff/Admin Tables
-- =============================

-- Staff Profiles (in same project; distinct from user_profiles)
CREATE TABLE IF NOT EXISTS staff_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    staff_id TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('staff','admin')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    accepting_orders BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_profiles_auth_user_id ON staff_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_staff_id ON staff_profiles(staff_id);

-- =============================
-- Indexes for performance
-- =============================
CREATE INDEX IF NOT EXISTS idx_food_items_category_id ON food_items(category_id);
CREATE INDEX IF NOT EXISTS idx_food_items_restaurant_id ON food_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_food_item_id ON order_items(food_item_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- =============================
-- RLS (Row Level Security) Policies
-- =============================
ALTER TABLE food_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access for food-related data
CREATE POLICY IF NOT EXISTS "Public read access for food categories" ON food_categories
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Public read access for food items" ON food_items
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Public read access for restaurants" ON restaurants
    FOR SELECT USING (true);

-- Users can only access their own orders and profile
CREATE POLICY IF NOT EXISTS "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY IF NOT EXISTS "Users can insert own order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY IF NOT EXISTS "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Staff Profiles RLS
-- Allow public read of active staff records to support staff login mapping via staff_id + full_name.
-- If you prefer to hide emails, replace this with an Edge Function.
CREATE POLICY IF NOT EXISTS "Public read active staff" ON staff_profiles
  FOR SELECT USING (active = TRUE);

-- Staff can read/update own staff profile
CREATE POLICY IF NOT EXISTS "Staff read own staff profile" ON staff_profiles
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY IF NOT EXISTS "Staff update own staff profile" ON staff_profiles
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Admin (staff with role='admin') can manage staff_profiles
CREATE POLICY IF NOT EXISTS "Admin manage staff" ON staff_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM staff_profiles sp WHERE sp.auth_user_id = auth.uid() AND sp.role = 'admin' AND sp.active = TRUE
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM staff_profiles sp WHERE sp.auth_user_id = auth.uid() AND sp.role = 'admin' AND sp.active = TRUE
    )
  );

-- Staff capabilities on domain data
-- Staff (active) can read all orders and order_items
CREATE POLICY IF NOT EXISTS "Staff read all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM staff_profiles sp WHERE sp.auth_user_id = auth.uid() AND sp.active = TRUE
    )
  );

CREATE POLICY IF NOT EXISTS "Staff update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM staff_profiles sp WHERE sp.auth_user_id = auth.uid() AND sp.active = TRUE
    )
  );

CREATE POLICY IF NOT EXISTS "Staff read all order_items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM staff_profiles sp WHERE sp.auth_user_id = auth.uid() AND sp.active = TRUE
    )
  );

-- Staff (active) can manage restaurants and items
CREATE POLICY IF NOT EXISTS "Staff manage restaurants" ON restaurants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM staff_profiles sp WHERE sp.auth_user_id = auth.uid() AND sp.active = TRUE
    )
  );

CREATE POLICY IF NOT EXISTS "Staff update restaurants" ON restaurants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM staff_profiles sp WHERE sp.auth_user_id = auth.uid() AND sp.active = TRUE
    )
  );

CREATE POLICY IF NOT EXISTS "Staff delete restaurants" ON restaurants
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM staff_profiles sp WHERE sp.auth_user_id = auth.uid() AND sp.active = TRUE
    )
  );

CREATE POLICY IF NOT EXISTS "Staff manage food_items" ON food_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM staff_profiles sp WHERE sp.auth_user_id = auth.uid() AND sp.active = TRUE
    )
  );

CREATE POLICY IF NOT EXISTS "Staff update food_items" ON food_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM staff_profiles sp WHERE sp.auth_user_id = auth.uid() AND sp.active = TRUE
    )
  );

CREATE POLICY IF NOT EXISTS "Staff delete food_items" ON food_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM staff_profiles sp WHERE sp.auth_user_id = auth.uid() AND sp.active = TRUE
    )
  );

-- =============================
-- Triggers for automatic updated_at maintenance
-- =============================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_food_categories_updated_at BEFORE UPDATE ON food_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_food_items_updated_at BEFORE UPDATE ON food_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_restaurants_updated_at BEFORE UPDATE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_order_items_updated_at BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_staff_profiles_updated_at BEFORE UPDATE ON staff_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
