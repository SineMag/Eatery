# Eatery - Restaurant Ordering Application

A comprehensive React Native restaurant ordering application built with Expo.

## Design

View the application design: [Figma Design Link](https://www.figma.com/design/YOUR_DESIGN_ID)

> **Note**: Replace the link above with your actual Figma/design file link

## Features

### User Features
- **Registration & Login**: Email/password authentication with full profile management
- **Profile Management**: Update name, email, address, contact number, and card details
- **Menu Browsing**: Browse food items by category (Burgers, Mains, Starters, Desserts, Beverages, Alcohol)
- **Item Customization**: Select sides, drinks, extras, and modify ingredients
- **Cart Management**: Add/remove items, edit quantities, edit customizations, clear cart
- **Checkout**: Change delivery address, select payment method, add new cards
- **Order Tracking**: View order status with progress indicators

### Admin Features
- **Dashboard**: Revenue charts, order statistics, top-selling items
- **Order Management**: View all orders, update order status
- **Menu Management**: Add, edit, and delete menu items
- **Restaurant Settings**: Update restaurant information

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context (Auth, Cart, Orders, Menu)
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
│   ├── item/[id].tsx          # Item detail with customization
│   ├── edit-cart-item/[id].tsx # Edit cart item
│   ├── checkout.tsx           # Checkout flow
│   ├── order/[id].tsx         # Order tracking
│   └── admin.tsx              # Admin dashboard
├── src/
│   ├── components/            # Reusable components
│   ├── contexts/              # React Context providers
│   ├── data/                  # Default menu data
│   └── types/                 # TypeScript definitions
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npm run start
   ```

## Payment Integration

The app currently uses simulated payment processing. To integrate a real payment provider:

1. Set up Stripe or PayPal developer account
2. Add API keys to environment secrets
3. Replace `simulatePayment()` function in checkout.tsx with real API calls

### Useful Links
- [Stripe API](https://stripe.com/docs/api)
- [PayPal Developer](https://developer.paypal.com/dashboard/)
- [VCC Generator for Testing](https://www.vccgenerator.org/)

## Responsive Design

The app adapts to different screen sizes:
- **Mobile**: < 768px width
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Currency

All prices are displayed in South African Rand (R)

## Screenshots

> Add screenshots of your application here

## License

This project is for educational purposes.
