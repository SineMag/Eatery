# Eatery - Restaurant Ordering Application

## Overview
A comprehensive React Native restaurant ordering application built with Expo. Features user authentication, menu browsing with categories, item customization, cart management, checkout, order tracking, and an admin dashboard.

## Tech Stack
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context (Auth, Cart, Orders)
- **Storage**: AsyncStorage for local persistence
- **Backend Ready**: Supabase client configured (currently using local storage)
- **Language**: TypeScript

## Project Structure
```
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── menu.tsx       # Menu browsing
│   │   ├── cart.tsx       # Shopping cart
│   │   ├── orders.tsx     # Order history
│   │   └── profile.tsx    # User profile
│   ├── auth/              # Authentication screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── item/[id].tsx      # Item detail with customization
│   ├── checkout.tsx       # Checkout flow
│   ├── order/[id].tsx     # Order detail
│   └── admin.tsx          # Admin dashboard
├── src/
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── OrderContext.tsx
│   ├── data/              # Mock data
│   │   └── menuData.ts
│   ├── lib/               # Utilities
│   │   └── supabase.ts
│   └── types/             # TypeScript definitions
│       └── index.ts
├── components/            # Reusable components
├── constants/             # Theme colors
└── hooks/                 # Custom hooks
```

## Features

### User Features
- **Registration**: Email/password with full profile (name, surname, contact, address, card details)
- **Login**: Email/password authentication
- **Profile Management**: Update personal info, contact, address, payment details
- **Menu Browsing**: Browse by category (Burgers, Mains, Starters, Desserts, Beverages, Alcohol)
- **Item Customization**: Select sides, drinks, extras, modify ingredients
- **Cart Management**: Add/remove items, update quantities, clear cart
- **Checkout**: Delivery address, payment method selection
- **Order Tracking**: View order status and history

### Admin Features
- **Dashboard**: Revenue stats, order counts, top-selling items
- **Order Management**: View all orders, update status
- **Menu Overview**: View all menu items by category

## Key Implementation Details

### Food Item Customization
Each food item can have:
- **Sides**: Up to 2 included sides (chips, salad, pap, etc.)
- **Drinks**: Included or add-on drinks with prices
- **Extras**: Additional items that add to the price
- **Ingredients**: Remove or add ingredients to customize

### Order Flow
1. Browse menu by category
2. View item details and customize
3. Add to cart with quantity
4. Review cart and proceed to checkout
5. Enter delivery address and payment method
6. Place order (stored locally with status tracking)

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

## Recent Changes
- January 2026: Initial implementation with full feature set
- Authentication with profile management
- Complete cart and checkout flow
- Admin dashboard with analytics
