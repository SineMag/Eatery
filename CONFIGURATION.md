# Eatery App - Configuration & Setup Summary

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root with:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (EXPO_PUBLIC_SUPABASE_URL)
   - **anon public** key (EXPO_PUBLIC_SUPABASE_ANON_KEY)

## 📦 Dependencies

### Core Dependencies

```json
{
  "expo": "~54.0.32",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo-router": "~6.0.22",
  "@supabase/supabase-js": "^2.93.2",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "typescript": "~5.9.2"
}
```

### Installation

```bash
npm install
```

## 🗄️ Database Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in/up
4. Click "New Project"
5. Fill in project details
6. Wait for project to be created

### Step 2: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy contents of `scripts/supabase-schema.sql`
4. Paste into SQL editor
5. Click "Run"

### Step 3: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Set **Site URL**: `http://localhost:8081`
3. Enable **Email** provider
4. Save settings

### Step 4: Set Up RLS Policies

The schema includes RLS policies. Verify they're created:

1. Go to **Authentication** → **Policies**
2. Check that policies are enabled for all tables
3. Verify user isolation policies

## 🚀 Running the Application

### Development Server

```bash
npm start
```

Then choose:
- `i` - iOS simulator
- `a` - Android emulator
- `w` - Web browser

### Building for Production

```bash
# Android
expo build:android

# iOS
expo build:ios

# Web
expo build:web
```

## 📱 App Configuration

### app.json

```json
{
  "expo": {
    "name": "Eatery",
    "slug": "eatery",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/Eatery Logo.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/Eatery Logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTabletMode": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/Eatery Logo.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/images/Eatery Logo.png"
    }
  }
}
```

## 🎨 Theme Configuration

### Color System

Located in `constants/theme.ts`:

```typescript
export const colors = {
  primary: '#11181C',
  secondary: '#6b7280',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f9fafb',
  border: '#e5e5e5',
  text: '#11181C',
  textSecondary: '#6b7280',
};
```

## 🔐 Security Configuration

### Supabase RLS Policies

All tables have Row Level Security enabled:

- **food_categories**: Public read
- **food_items**: Public read
- **restaurants**: Public read
- **orders**: User-specific access
- **order_items**: User-specific access
- **user_profiles**: User-specific access

### Authentication

- Email/password authentication via Supabase
- Session management with Supabase Auth
- Secure token storage

## 📊 Database Tables

### food_categories
```sql
CREATE TABLE food_categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  order_num INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### food_items
```sql
CREATE TABLE food_items (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL,
  image_url TEXT,
  category_id UUID REFERENCES food_categories,
  restaurant_id UUID REFERENCES restaurants,
  sides JSONB,
  drinks JSONB,
  extras JSONB,
  optional_ingredients JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  total DECIMAL,
  status TEXT,
  delivery_address TEXT,
  payment_method TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### order_items
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders,
  food_item_id UUID REFERENCES food_items,
  quantity INTEGER,
  subtotal DECIMAL,
  selected_sides JSONB,
  selected_drinks JSONB,
  selected_extras JSONB,
  selected_ingredients JSONB,
  customizations JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### user_profiles
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT,
  surname TEXT,
  contact_number TEXT,
  address TEXT,
  profile_image TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🔄 API Endpoints

### Authentication

```typescript
// Sign up
supabase.auth.signUp({
  email: string,
  password: string,
  options: { data: { name: string } }
})

// Sign in
supabase.auth.signInWithPassword({
  email: string,
  password: string
})

// Sign out
supabase.auth.signOut()
```

### Database Operations

```typescript
// Read
supabase.from('table').select()

// Create
supabase.from('table').insert([data])

// Update
supabase.from('table').update(data).eq('id', id)

// Delete
supabase.from('table').delete().eq('id', id)
```

## 🧪 Testing Configuration

### Test Credentials

```
Email: test@example.com
Password: Test123!
```

### Test Data

Mock data is available in:
- `app/menu/[category].tsx` - Food items
- `app/(tabs)/orders.tsx` - Orders (before Supabase integration)
- `app/item/[itemId].tsx` - Item details

## 📱 Device Configuration

### iOS

- Minimum iOS version: 13.0
- Supports iPad
- Supports landscape orientation

### Android

- Minimum Android version: 5.0 (API 21)
- Supports tablets
- Supports landscape orientation

### Web

- Works on all modern browsers
- Responsive design
- Touch-friendly interface

## 🚀 Deployment Configuration

### Render.com

```yaml
# render.yaml
services:
  - type: web
    name: eatery
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: EXPO_PUBLIC_SUPABASE_URL
        value: your-url
      - key: EXPO_PUBLIC_SUPABASE_ANON_KEY
        value: your-key
```

### Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "EXPO_PUBLIC_SUPABASE_URL": "@supabase_url",
    "EXPO_PUBLIC_SUPABASE_ANON_KEY": "@supabase_key"
  }
}
```

## 🔍 Debugging

### Enable Debug Mode

```typescript
// In utils/supabase.ts
const supabase = createClient(url, key, {
  auth: {
    debug: true
  }
})
```

### Check Logs

```bash
# View Expo logs
npm start -- --verbose

# View Supabase logs
# Go to Supabase dashboard → Logs
```

## 📋 Checklist for Production

- [ ] Environment variables configured
- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] Authentication configured
- [ ] RLS policies verified
- [ ] Images optimized
- [ ] Error handling tested
- [ ] Performance optimized
- [ ] Security reviewed
- [ ] Documentation complete

## 🆘 Troubleshooting

### Issue: "Cannot connect to Supabase"
**Solution**: Check environment variables and Supabase project status

### Issue: "RLS policy violation"
**Solution**: Verify user is authenticated and has proper permissions

### Issue: "Build fails"
**Solution**: Run `npm install` and check for dependency conflicts

### Issue: "Images not loading"
**Solution**: Verify image URLs are correct and accessible

## 📞 Support

- **Supabase**: https://supabase.com/docs
- **Expo**: https://docs.expo.dev
- **React Native**: https://reactnative.dev/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Configuration Complete! Ready to Deploy 🚀**
