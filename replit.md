# Eatery - Restaurant Ordering Application

## Overview
A comprehensive React Native restaurant ordering application built with Expo. Features user authentication, menu browsing with categories, item customization, cart management, checkout with payment processing, order tracking, and an admin dashboard with analytics charts.

## Tech Stack
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context (Auth, Cart, Orders)
- **Storage**: AsyncStorage for local persistence
- **Icons**: Expo Vector Icons (@expo/vector-icons)
- **Charts**: react-native-chart-kit with react-native-svg
- **Language**: TypeScript

## Project Structure
```
├── app/                        # Expo Router screens
│   ├── (tabs)/                # Tab navigation screens
│   │   ├── index.tsx          # Home screen
│   │   ├── menu.tsx           # Menu browsing
│   │   ├── cart.tsx           # Shopping cart
│   │   ├── orders.tsx         # Order history
│   │   └── profile.tsx        # User profile
│   ├── auth/                  # Authentication screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── item/[id].tsx          # Item detail with customization
│   ├── edit-cart-item/[id].tsx # Edit cart item customizations
│   ├── checkout.tsx           # Checkout flow with payment
│   ├── order/[id].tsx         # Order detail with tracking
│   └── admin.tsx              # Admin dashboard
├── src/
│   ├── components/            # Reusable components
│   │   └── Icons.tsx          # Icon components using Expo Vector Icons
│   ├── contexts/              # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── OrderContext.tsx
│   ├── data/                  # Mock data
│   │   └── menuData.ts
│   ├── lib/                   # Utilities
│   │   └── supabase.ts
│   └── types/                 # TypeScript definitions
│       └── index.ts
├── components/                # Default Expo components
├── constants/                 # Theme colors
└── hooks/                     # Custom hooks
```

## Features

### User Features
- **Registration**: Email/password with full profile (name, surname, contact, address, card details)
- **Login**: Email/password authentication
- **Profile Management**: Update personal info, contact, address, payment details
- **Menu Browsing**: Browse by category (Burgers, Mains, Starters, Desserts, Beverages, Alcohol)
- **Item Customization**: Select sides, drinks, extras, modify ingredients
- **Cart Management**: 
  - Add/remove items
  - Update quantities
  - Edit item customizations (navigate to edit page)
  - Clear entire cart
- **Checkout**: 
  - Change delivery address (default to registered address)
  - Select/add payment cards
  - Cash on delivery option
  - Simulated payment processing
- **Order Tracking**: View order status with progress indicators

### Admin Features
- **Dashboard with Charts**: 
  - Revenue bar chart (last 7 days)
  - Order status pie chart
  - Stats cards (revenue, orders, avg order value)
  - Top-selling items
- **Order Management**: View all orders, update status workflow
- **Menu Management**: View all menu items by category (CRUD ready)
- **Restaurant Settings**: Update restaurant information

## Key Implementation Details

### Food Item Customization
Each food item can have:
- **Sides**: Up to 2 included sides (chips, salad, pap, etc.)
- **Drinks**: Included or add-on drinks with prices
- **Extras**: Additional items that add to the price
- **Ingredients**: Remove or add ingredients to customize

### Cart Features
- View current items with customizations displayed
- Edit quantity with +/- buttons
- Remove individual items with confirmation
- Navigate to edit customizations for any cart item
- Clear all items with confirmation
- Checkout requires authentication (prompt for non-registered users)

### Checkout Features
- Delivery address (pre-filled with registered address)
- Change to different delivery location
- Payment method selection (card/cash)
- Add new card functionality
- Order summary with itemized list
- Simulated payment processing with loading state

### Order Flow
1. Browse menu by category
2. View item details and customize
3. Add to cart with quantity
4. Review cart (edit quantities/customizations)
5. Proceed to checkout (requires login)
6. Enter delivery address and payment method
7. Place order with simulated payment
8. Track order status

## Payment Integration Note
The app currently uses simulated payment processing. To integrate a real payment provider:
1. Set up Stripe or similar payment API
2. Replace `simulatePayment()` function in checkout.tsx
3. Add payment API keys to environment secrets

## Running the App
```bash
npm run start    # Starts Expo web on port 5000
npm run dev      # Same as start
```

## Color Scheme
- **Primary**: #11181C (Dark)
- **Accent**: #3b82f6 (Blue)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)
- **Background**: #f9fafb (Light Gray)

## Currency
All prices are displayed in South African Rand (R)

## Icons
Using Expo Vector Icons for all icons throughout the app:
- Ionicons for navigation and general UI
- MaterialCommunityIcons for food categories
- FontAwesome5 for specific icons
- Feather for utility icons

## Recent Changes
- January 2026: Enhanced cart with edit customization navigation
- Enhanced checkout with card management and simulated payments
- Added admin dashboard with revenue/order charts
- Replaced all emojis with vector icons
- Added restaurant settings management
- Improved order tracking with progress indicators
