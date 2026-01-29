# Environment Setup Guide

## 🔧 Prerequisites

- Node.js v18 or higher
- npm or yarn
- Expo CLI
- Git
- A code editor (VS Code recommended)

## 📋 Step-by-Step Setup

### 1. Install Node.js

**Windows/Mac/Linux**:
- Download from [nodejs.org](https://nodejs.org)
- Install LTS version
- Verify installation:
```bash
node --version
npm --version
```

### 2. Install Expo CLI

```bash
npm install -g expo-cli
```

Verify:
```bash
expo --version
```

### 3. Clone Repository

```bash
git clone https://github.com/SineMag/Eatery.git
cd Eatery
```

### 4. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React Native
- Expo
- Supabase
- Stripe
- And more...

### 5. Create Environment File

Create `.env` file in the root directory:

```bash
# For Windows
copy .env.example .env

# For Mac/Linux
cp .env.example .env
```

### 6. Configure Environment Variables

Edit `.env` and add your credentials:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe Configuration (Optional)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here

# Google Maps (Optional)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key-here
```

## 🔑 Getting API Keys

### Supabase Setup

1. Go to [supabase.com](https://supabase.com)
2. Sign up or login
3. Create a new project
4. Go to Project Settings → API
5. Copy:
   - Project URL → `EXPO_PUBLIC_SUPABASE_URL`
   - Anon Key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Stripe Setup

1. Go to [stripe.com](https://stripe.com)
2. Sign up or login
3. Go to Developers → API Keys
4. Copy Publishable Key → `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Google Maps Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Maps API
4. Create API key
5. Copy → `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`

## 🗄️ Database Setup

### Create Supabase Tables

1. Go to Supabase Dashboard
2. Go to SQL Editor
3. Run the schema from `scripts/supabase-schema.sql`

Or manually create tables:

```sql
-- Users (handled by Supabase Auth)

-- User Profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name VARCHAR(255),
  surname VARCHAR(255),
  contact_number VARCHAR(20),
  address TEXT,
  profile_image TEXT,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Food Categories
CREATE TABLE food_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  order_num INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Restaurants
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  rating DECIMAL(3,2),
  address TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Food Items
CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  category_id UUID REFERENCES food_categories(id),
  restaurant_id UUID REFERENCES restaurants(id),
  distance VARCHAR(50),
  delivery_time VARCHAR(50),
  sides JSONB,
  drinks JSONB,
  extras JSONB,
  optional_ingredients JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  total DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  delivery_address TEXT,
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  food_item_id UUID NOT NULL REFERENCES food_items(id),
  quantity INTEGER,
  subtotal DECIMAL(10,2),
  selected_sides JSONB,
  selected_drinks JSONB,
  selected_extras JSONB,
  selected_ingredients JSONB,
  customizations JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies (example for user_profiles)
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

## 🚀 Running the App

### Development Mode

```bash
npm start
```

This will start the Expo development server.

### Run on iOS

```bash
npm start
# Then press 'i'
```

Or:
```bash
npm run ios
```

### Run on Android

```bash
npm start
# Then press 'a'
```

Or:
```bash
npm run android
```

### Run on Web

```bash
npm start
# Then press 'w'
```

Or:
```bash
npm run web
```

## 🧪 Testing

### Test User Account

Create a test account:
- Email: `test@example.com`
- Password: `password123`

Or register a new account through the app.

### Test Staff Account

Use these credentials:
- Staff ID: `staff001`
- Name: `John Doe`
- Password: `password123`

### Test Payment Cards

Use Stripe test cards:
- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **Amex**: 3782 822463 10005

Expiry: Any future date  
CVC: Any 3 digits

## 🔍 Troubleshooting

### Issue: npm install fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Expo not found

**Solution**:
```bash
# Install Expo CLI globally
npm install -g expo-cli

# Verify
expo --version
```

### Issue: Port 8081 already in use

**Solution**:
```bash
# Kill process on port 8081
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8081
kill -9 <PID>
```

### Issue: Supabase connection error

**Solution**:
1. Check `.env` file has correct URL and key
2. Verify Supabase project is active
3. Check internet connection
4. Verify API key permissions

### Issue: Stripe payment not working

**Solution**:
1. Check Stripe key in `.env`
2. Verify Stripe account is active
3. Use test cards for testing
4. Check browser console for errors

## 📦 Project Structure

```
Eatery/
├── app/                    # Screens and routes
│   ├── auth/              # Authentication screens
│   ├── admin/             # Admin dashboard
│   ├── (tabs)/            # Tab screens
│   └── index.tsx          # Home screen
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── types/                 # TypeScript types
├── constants/             # App constants
├── assets/                # Images and fonts
├── scripts/               # Setup scripts
├── .env                   # Environment variables
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

## 🔐 Security Best Practices

1. **Never commit `.env` file**
   - Add to `.gitignore`
   - Use `.env.example` for template

2. **Keep API keys secret**
   - Don't share keys
   - Rotate keys regularly
   - Use environment variables

3. **Enable RLS on database**
   - Restrict data access
   - Implement policies
   - Test permissions

4. **Validate user input**
   - Check email format
   - Validate passwords
   - Sanitize data

5. **Use HTTPS**
   - Enable SSL/TLS
   - Verify certificates
   - Use secure connections

## 📚 Additional Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

## ✅ Verification Checklist

- [ ] Node.js installed
- [ ] Expo CLI installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] `.env` file created
- [ ] API keys configured
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] App starts successfully
- [ ] Can login/register
- [ ] Can browse menu
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Can view orders

## 🎉 You're Ready!

Once all steps are complete, you're ready to:
1. Start development
2. Test features
3. Deploy to production

For questions or issues, refer to the documentation or contact support.

---

**Last Updated**: January 2026  
**Version**: 1.0.0
