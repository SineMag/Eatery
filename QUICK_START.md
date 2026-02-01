

# Eatery App - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Clone the Repository

```bash
git clone https://github.com/SineMag/Eatery.git
cd Eatery
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Create a new query
5. Copy and paste the contents of `scripts/supabase-schema.sql`
6. Click "Run"

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 5: Start the App

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser

## 📱 Testing the App

### Create a Test Account

1. Click "Register" on the landing screen
2. Fill in the form:
   - Email: `test@example.com`
   - Password: `Test123!`
   - Name: `John`
   - Surname: `Doe`
   - Contact: `555-1234`
   - Address: `123 Main St`

### Browse Menu

1. Click on a category (e.g., "Mains")
2. Click on a food item
3. Customize the item (select sides, drinks, extras)
4. Click "Add to Cart"

### Place an Order

1. Go to Cart tab
2. Review items
3. Click "Proceed to Checkout"
4. Enter delivery address
5. Select payment method
6. Click "Place Order"

### View Orders

1. Go to Orders tab
2. See your order history
3. Click on an order to see details

### Access Admin Dashboard

1. Go to Settings tab
2. Scroll down and look for admin access (or navigate directly to `/admin/dashboard`)
3. View analytics and manage items

## 🔧 Troubleshooting

### Issue: "Cannot find module"
**Solution**: Run `npm install` again

### Issue: "Invalid Supabase credentials"
**Solution**: Check your `.env` file has correct URL and key

### Issue: "Database relation does not exist"
**Solution**: Run the schema setup script in Supabase SQL Editor

### Issue: "Port 8081 already in use"
**Solution**: Kill the process or use a different port:
```bash
npm start -- --port 8082
```

## 📚 Project Structure

```
Eatery/
├── app/                    # Screens and navigation
├── components/             # Reusable components
├── hooks/                  # Custom hooks (useAuth, useCart)
├── utils/                  # Utility functions
├── types/                  # TypeScript types
├── constants/              # App constants
├── assets/                 # Images
└── scripts/                # Database scripts
```

## 🎯 Key Files to Know

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root navigation setup |
| `hooks/useAuth.tsx` | Authentication context |
| `hooks/useCart.tsx` | Cart state management |
| `utils/supabase.ts` | Supabase client |
| `app/index.tsx` | Home screen |
| `app/admin/dashboard.tsx` | Admin panel |

## 🔑 Key Features to Try

### 1. User Authentication
- Register with email/password
- Login/logout
- Update profile

### 2. Menu Browsing
- Browse by category
- View item details
- See customization options

### 3. Shopping Cart
- Add items with customizations
- Update quantities
- Remove items
- Clear cart

### 4. Checkout
- Enter delivery address
- Select payment method
- Place order

### 5. Order Tracking
- View order history
- See order details
- Track order status

### 6. Admin Dashboard
- View analytics
- See revenue charts
- Manage food items
- View orders

## 💡 Tips

1. **Use Test Data**: The app comes with mock data for testing
2. **Check Console**: Open dev tools to see logs and errors
3. **Test on Device**: Use Expo Go app on your phone
4. **Read Documentation**: Check README.md and IMPLEMENTATION_GUIDE.md

## 🚀 Next Steps

1. **Customize**: Update colors, fonts, and branding
2. **Add Data**: Add real food items to Supabase
3. **Integrate Payments**: Add Stripe or PayPal
4. **Deploy**: Build and deploy to app stores
5. **Monitor**: Set up analytics and error tracking

## 📞 Support

- **Documentation**: See README.md and IMPLEMENTATION_GUIDE.md
- **Issues**: Check GitHub issues
- **Supabase Help**: https://supabase.com/docs
- **React Native Help**: https://reactnative.dev/docs

## 🎓 Learning Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

---

**Happy coding! 🎉**
