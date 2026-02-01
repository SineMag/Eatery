-- ============================================
-- EATERY APP - COMPLETE DATABASE SCHEMA
-- ============================================

-- ============================================
-- 1. USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  surname VARCHAR(255),
  contact_number VARCHAR(20),
  address TEXT,
  profile_image TEXT,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. FOOD CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.food_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  order_num INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. RESTAURANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  image_url TEXT,
  rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. FOOD ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id UUID NOT NULL REFERENCES public.food_categories(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
et m  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  delivery_address TEXT NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES public.food_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal DECIMAL(10,2) NOT NULL,
  selected_sides JSONB,
  selected_drinks JSONB,
  selected_extras JSONB,
  selected_ingredients JSONB,
  customizations JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 7. STAFF PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 8. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 9. CREATE RLS POLICIES - USER PROFILES
-- ============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 10. CREATE RLS POLICIES - ORDERS
-- ============================================
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update their own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 11. CREATE RLS POLICIES - ORDER ITEMS
-- ============================================
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;
CREATE POLICY "Users can view their order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- 12. PUBLIC READ ACCESS POLICIES
-- ============================================
DROP POLICY IF EXISTS "Anyone can view food items" ON public.food_items;
CREATE POLICY "Anyone can view food items"
  ON public.food_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can view categories" ON public.food_categories;
CREATE POLICY "Anyone can view categories"
  ON public.food_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can view restaurants" ON public.restaurants;
CREATE POLICY "Anyone can view restaurants"
  ON public.restaurants FOR SELECT
  USING (true);

-- ============================================
-- 13. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_food_items_category_id ON public.food_items(category_id);
CREATE INDEX IF NOT EXISTS idx_food_items_restaurant_id ON public.food_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_staff_id ON public.staff_profiles(staff_id);

-- ============================================
-- 14. INSERT SAMPLE DATA - CATEGORIES
-- ============================================
INSERT INTO public.food_categories (name, order_num) VALUES
  ('Mains', 1),
  ('Starters', 2),
  ('Desserts', 3),
  ('Beverages', 4),
  ('Burgers', 5),
  ('Alcohol', 6);

-- ============================================
-- 15. INSERT SAMPLE DATA - RESTAURANTS
-- ============================================
INSERT INTO public.restaurants (name, image_url, rating) VALUES
  ('KFC', 'https://example.com/kfc.jpg', 4.2),
  ('McDonald''s', 'https://example.com/mcdonalds.jpg', 4.0),
  ('Nandos', 'https://example.com/nandos.jpg', 4.5),
  ('Pedros', 'https://example.com/pedros.jpg', 4.3),
  ('Hungry Lion', 'https://example.com/hungrylion.jpg', 3.9),
  ('Vida e Caffè', 'https://example.com/vida.jpg', 4.4);

-- ============================================
-- 16. INSERT SAMPLE DATA - FOOD ITEMS
-- ============================================
INSERT INTO public.food_items (name, description, price, image_url, category_id, restaurant_id) 
SELECT 
  'Grilled Chicken',
  'Tender grilled chicken breast with herbs and spices',
  120.00,
  'https://example.com/grilled-chicken.jpg',
  (SELECT id FROM public.food_categories WHERE name = 'Mains' LIMIT 1),
  (SELECT id FROM public.restaurants WHERE name = 'KFC' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.food_items WHERE name = 'Grilled Chicken');

INSERT INTO public.food_items (name, description, price, image_url, category_id, restaurant_id) 
SELECT 
  'Classic Burger',
  'Classic beef burger with cheese and special sauce',
  85.00,
  'https://example.com/burger.jpg',
  (SELECT id FROM public.food_categories WHERE name = 'Burgers' LIMIT 1),
  (SELECT id FROM public.restaurants WHERE name = 'McDonald''s' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.food_items WHERE name = 'Classic Burger');

INSERT INTO public.food_items (name, description, price, image_url, category_id, restaurant_id) 
SELECT 
  'Spring Rolls',
  'Crispy vegetable spring rolls with sweet chili sauce',
  45.00,
  'https://example.com/spring-rolls.jpg',
  (SELECT id FROM public.food_categories WHERE name = 'Starters' LIMIT 1),
  (SELECT id FROM public.restaurants WHERE name = 'Nandos' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.food_items WHERE name = 'Spring Rolls');

INSERT INTO public.food_items (name, description, price, image_url, category_id, restaurant_id) 
SELECT 
  'Chocolate Cake',
  'Rich chocolate cake with ganache',
  65.00,
  'https://example.com/chocolate-cake.jpg',
  (SELECT id FROM public.food_categories WHERE name = 'Desserts' LIMIT 1),
  (SELECT id FROM public.restaurants WHERE name = 'Vida e Caffè' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.food_items WHERE name = 'Chocolate Cake');

INSERT INTO public.food_items (name, description, price, image_url, category_id, restaurant_id) 
SELECT 
  'Fresh Juice',
  'Freshly squeezed orange juice',
  25.00,
  'https://example.com/juice.jpg',
  (SELECT id FROM public.food_categories WHERE name = 'Beverages' LIMIT 1),
  (SELECT id FROM public.restaurants WHERE name = 'Vida e Caffè' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.food_items WHERE name = 'Fresh Juice');

-- ============================================
-- 17. INSERT SAMPLE DATA - STAFF
-- ============================================
INSERT INTO public.staff_profiles (staff_id, name, password_hash, active) VALUES
  ('ID0001', 'John Doe', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', true);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- All tables created and sample data inserted successfully!
-- The database is now ready for the Eatery app.
