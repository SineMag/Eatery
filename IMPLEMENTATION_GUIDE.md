# Eatery App - Implementation Guide

## Project Overview

Eatery is a full-featured React Native restaurant ordering application that allows users to browse menus, customize orders, manage their cart, and place orders. It includes an admin dashboard for restaurant management and analytics.

## Architecture

### Project Structure

```
Eatery/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx            # Home screen
│   │   ├── cart.tsx             # Shopping cart
│   │   ├── orders.tsx           # Order history
│   │   ├── profile.tsx          # User profile
│   │   └── settings.tsx         # Settings
│   ├── auth/                     # Authentication screens
│   │   ├── login.tsx            # Login screen
│   │   └── register.tsx         # Registration screen
│   ├── menu/                     # Menu screens
│   │   └── [category].tsx       # Category menu
│   ├── item/                     # Item detail
│   │   └── [itemId].tsx         # Item customization
│   ├── order/                    # Order details
│   │   └── [orderId].tsx        # Order tracking
│   ├── admin/                    # Admin dashboard
│   │   └── dashboard.tsx        # Admin panel
│   ├── checkout.tsx             # Checkout screen
│   ├── payment.tsx              # Payment screen
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
├── hooks/                        # Custom React hooks
├── utils/                        # Utility functions
├── types/                        # TypeScript types
├── constants/                    # App constants
├── assets/                       # Images and media
└── scripts/                      # Database scripts
```

## Core Features Implementation

### 1. Authentication System

**Location**: `app/auth/`, `hooks/useAuth.tsx`

**Features**:
- Email/password registration
- Email/password login
- Session management
- Profile creation during registration
- Password reset (ready for implementation)

**Key Functions**:
```typescript
signUp(email, password, name)    // Register new user
signIn(email, password)          // Login user
signOut()                        // Logout user
```

### 2. Menu System

**Location**: `app/menu/[category].tsx`

**Features**:
- Browse food items by category
- Filter items by restaurant
- Display item details (name, description, price, image)
- Add items to cart

**Categories**:
- Mains
- Starters
- Desserts
- Beverages
- Alcohol
- Burgers

### 3. Item Customization

**Location**: `app/item/[itemId].tsx`

**Customization Options**:
- **Sides**: Choose one or two sides (included in price)
- **Drinks**: Add a drink (with optional price)
- **Extras**: Add additional items (with price)
- **Ingredients**: Remove or add ingredients
- **Quantity**: Select quantity

### 4. Cart Management

**Location**: `hooks/useCart.tsx`, `app/(tabs)/cart.tsx`

**Features**:
- Add items with customizations
- Update quantities
- Remove individual items
- Clear entire cart
- Calculate totals with tax and delivery

**Cart Item Structure**:
```typescript
{
  id: string,
  foodItem: FoodItem,
  quantity: number,
  selectedSides?: Option[],
  selectedDrinks?: Option[],
  selectedExtras?: Option[],
  selectedIngredients?: Option[],
  customizations?: {
    removeIngredients: string[],
    addIngredients: string[]
  }
}
```

### 5. Checkout & Order Placement

**Location**: `app/checkout.tsx`

**Features**:
- Review order items
- Enter/modify delivery address
- Select payment method
- View order total with tax and delivery fee
- Place order (saves to Supabase)

**Order Creation**:
```typescript
// Creates order in Supabase
const order = {
  user_id: user.uid,
  total: calculateTotal(),
  status: 'pending',
  delivery_address: address,
  payment_method: selectedCard
}

// Creates order items
const orderItems = items.map(item => ({
  order_id: order.id,
  food_item_id: item.foodItem.id,
  quantity: item.quantity,
  subtotal: item.foodItem.price * item.quantity,
  selected_sides: item.selectedSides,
  selected_drinks: item.selectedDrinks,
  selected_extras: item.selectedExtras,
  customizations: item.customizations
}))
```

### 6. Order Tracking

**Location**: `app/(tabs)/orders.tsx`, `app/order/[orderId].tsx`

**Features**:
- View all user orders
- Filter by status (all, pending, completed)
- View detailed order information
- Track order status
- Rate delivered orders

**Order Statuses**:
- `pending`: Order received, awaiting confirmation
- `confirmed`: Order confirmed by restaurant
- `preparing`: Restaurant is preparing the order
- `ready`: Order ready for delivery
- `delivered`: Order delivered
- `cancelled`: Order cancelled

### 7. User Profile

**Location**: `app/(tabs)/profile.tsx`

**Features**:
- View user information
- Edit profile details
- Upload profile image
- Manage payment methods
- View order history

**Editable Fields**:
- Name
- Surname
- Email (read-only)
- Contact Number
- Address
- Profile Image

### 8. Admin Dashboard

**Location**: `app/admin/dashboard.tsx`

**Features**:
- **Overview Tab**: Key metrics and analytics
- **Orders Tab**: View and manage orders
- **Items Tab**: Add, edit, delete food items
- **Settings Tab**: Restaurant configuration

**Analytics Displayed**:
- Total orders
- Total revenue
- Average order value
- Total customers
- Monthly statistics
- Revenue by day (chart)
- Top-selling items
- Order status distribution

## Database Integration

### Supabase Setup

1. **Create Project**: Go to supabase.com and create a new project
2. **Run Schema**: Execute `scripts/supabase-schema.sql` in SQL Editor
3. **Configure Auth**: Enable email/password authentication
4. **Set Environment Variables**: Add credentials to `.env`

### Key Tables

**food_categories**
- Stores food categories (Mains, Starters, etc.)
- Used for menu filtering

**food_items**
- Stores all food items
- Includes customization options (sides, drinks, extras)
- Links to categories and restaurants

**orders**
- Stores user orders
- Tracks order status and total
- Links to user and delivery address

**order_items**
- Stores items in each order
- Includes customizations and quantities
- Links to food items

**user_profiles**
- Stores user profile information
- Links to Supabase auth users

## State Management

### Context Providers

**AuthContext** (`hooks/useAuth.tsx`)
- Manages user authentication state
- Provides sign up, sign in, sign out functions
- Fetches user profile from Supabase

**CartContext** (`hooks/useCart.tsx`)
- Manages shopping cart state
- Provides add, remove, update functions
- Calculates totals

## API Integration

### Supabase Client

**Location**: `utils/supabase.ts`

**Key Functions**:
```typescript
// Authentication
supabase.auth.signUp()
supabase.auth.signInWithPassword()
supabase.auth.signOut()

// Database
supabase.from('table_name').select()
supabase.from('table_name').insert()
supabase.from('table_name').update()
supabase.from('table_name').delete()
```

## Styling

### Theme System

**Colors** (`constants/theme.ts`):
- Primary: #11181C
- Secondary: #6b7280
- Accent: #3b82f6
- Success: #10b981
- Warning: #f59e0b
- Error: #ef4444

### Responsive Design

- Mobile-first approach
- Flexible layouts using flexbox
- Responsive font sizes
- Adaptive spacing

## Component Reusability

### Key Reusable Components

**AppHeader** (`components/app-header.tsx`)
- Top navigation bar
- Logo and user avatar
- Cart icon with badge

**BottomNavigation** (`components/bottom-navigation.tsx`)
- Tab navigation
- Active tab highlighting
- Icons for each tab

**IconSymbol** (`components/ui/icon-symbol.tsx`)
- SF Symbols integration
- Consistent icon usage

**Snackbar** (`components/snackbar.tsx`)
- Toast notifications
- Success/error messages

## Testing

### Manual Testing Checklist

- [ ] User registration with all fields
- [ ] User login with valid credentials
- [ ] Profile update and image upload
- [ ] Browse menu by category
- [ ] Customize food items
- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Clear cart
- [ ] Checkout process
- [ ] Order placement
- [ ] View order history
- [ ] View order details
- [ ] Admin dashboard access
- [ ] Admin analytics viewing

## Deployment

### Prerequisites

- Expo account
- Supabase project
- GitHub repository

### Steps

1. **Build for Android**:
   ```bash
   expo build:android
   ```

2. **Build for iOS**:
   ```bash
   expo build:ios
   ```

3. **Deploy to Web**:
   ```bash
   expo build:web
   ```

4. **Deploy to Render**:
   - Connect GitHub repo
   - Configure build command
   - Deploy

## Troubleshooting

### Common Issues

**Issue**: "Invalid login credentials"
- **Solution**: Ensure user exists in Supabase Auth and email is confirmed

**Issue**: "Database relation does not exist"
- **Solution**: Run schema setup script in Supabase SQL Editor

**Issue**: "CORS errors"
- **Solution**: Add your domain to Supabase CORS settings

**Issue**: "RLS policy violation"
- **Solution**: Check that user is authenticated and has proper permissions

## Performance Optimization

### Implemented

- Lazy loading of images
- Memoization of components
- Efficient state management
- Optimized database queries

### Future Improvements

- Image caching
- Pagination for large lists
- Offline support
- Service workers

## Security Considerations

- Supabase RLS policies enforce user data isolation
- Environment variables protect sensitive data
- Input validation on all forms
- Secure authentication with Supabase

## Future Enhancements

1. **Payment Integration**: Stripe or PayPal
2. **Real-time Notifications**: Push notifications for order updates
3. **Rating System**: User reviews and ratings
4. **Loyalty Program**: Points and rewards
5. **Multi-language**: i18n support
6. **Advanced Analytics**: More detailed admin reports
7. **Social Features**: Share orders, referrals
8. **Offline Mode**: Work without internet

## Support & Documentation

- Supabase Docs: https://supabase.com/docs
- React Native Docs: https://reactnative.dev
- Expo Docs: https://docs.expo.dev
- TypeScript Docs: https://www.typescriptlang.org/docs

---

**Last Updated**: January 2026
**Version**: 1.0.0
