<img src="https://socialify.git.ci/SineMag/Eatery/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="Eatery" width="640" height="320" />

--- 

# Eatery - React Native Restaurant App

A modern React Native restaurant ordering application built with Expo, Supabase, and TypeScript. Features include user authentication, menu browsing, cart management, order tracking, and an admin dashboard.

## 🚀 Features

### User Features

- **Authentication**: Email/password registration and login with Supabase
- **Menu Browsing**: Browse food items by categories (Mains, Starters, Desserts, Beverages, Alcohol, Burgers)
- **Item Customization**: Select sides, drinks, extras, and ingredient preferences
- **Cart Management**: Add/remove items, update quantities, clear cart
- **Checkout**: Select delivery address and payment method
- **Order History**: View and track order status with real-time updates
- **Profile Management**: Update personal information and payment methods
- **Order Tracking**: View detailed order information and status

### Admin Features

- **Dashboard**: Comprehensive analytics and metrics
- **Revenue Analytics**: Charts showing revenue by day and top-selling items
- **Order Management**: View and manage all orders
- **Food Item Management**: Add, edit, and delete food items
- **Restaurant Settings**: Manage restaurant information
- **Order Status Distribution**: Visual representation of order statuses

## 🛠 Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **State Management**: React Context (Auth, Cart)
- **UI Components**: Expo Symbols, Custom components
- **Styling**: React Native StyleSheet with dark/light theme support
- **Icons**: Expo Symbols (SF Symbols)
- **TypeScript**: Full type safety
- **Database**: PostgreSQL with Supabase

## 📱 Screens

### Authentication

- **Login**: Email/password authentication
- **Register**: Full profile setup with contact details
- **Profile**: User information management and updates

### Main App

- **Home**: Category grid navigation and personalized recommendations
- **Menu**: Category-specific food items with filtering
- **Item Detail**: Customization options and add to cart
- **Cart**: Item management and checkout
- **Checkout**: Address and payment selection
- **Orders**: Order history with status tracking
- **Order Detail**: Detailed order information
- **Profile**: User information and settings

### Admin

- **Dashboard**: Analytics overview
- **Orders**: Order management
- **Items**: Food item management
- **Settings**: Restaurant configuration

## 🎨 Design

### Color Scheme

- **Primary**: #11181C (Dark Grey/Black)
- **Secondary**: #6b7280 (Medium Grey)
- **Accent**: #3b82f6 (Blue)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)
- **Background**: #f9fafb (Light Grey)
- **Border**: #e5e5e5 (Light Border)

### Typography

- **Headings**: 24px, Bold (700)
- **Section Titles**: 18px, Semi-bold (600)
- **Body**: 14-16px, Regular (400-500)
- **Small**: 12px, Regular (400)

### Layout

- **Card-based design** with proper spacing
- **Responsive** for various screen sizes
- **Bottom navigation** for main tabs
- **Horizontal scrolling** for categories and restaurants
- **Grid layout** for menu items

## 🔧 Setup

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI
- Supabase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/SineMag/Eatery.git
cd Eatery
```

2. Install dependencies

```bash
npm install
```

3. Set up Supabase
   - Go to [Supabase Console](https://supabase.com)
   - Create a new project
   - Run the schema from `scripts/supabase-schema.sql`
   - Get your project URL and anon key

4. Configure environment variables
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your Supabase credentials:
     ```
     EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     ```

5. Start the development server

```bash
npm start
```

## 📊 Database Schema

### Users (via Supabase Auth)

```typescript
{
  id: string (UUID),
  email: string,
  created_at: timestamp
}
```

### User Profiles

```typescript
{
  id: UUID,
  user_id: UUID (FK to auth.users),
  name: string,
  surname: string,
  contact_number: string,
  address: string,
  profile_image: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Food Categories

```typescript
{
  id: UUID,
  name: string,
  order_num: integer,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Restaurants

```typescript
{
  id: UUID,
  name: string,
  description: string,
  image_url: string,
  rating: decimal,
  address: string,
  phone: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Food Items

```typescript
{
  id: UUID,
  name: string,
  description: string,
  price: decimal,
  image_url: string,
  category_id: UUID (FK),
  restaurant_id: UUID (FK),
  distance: string,
  delivery_time: string,
  sides: JSONB,
  drinks: JSONB,
  extras: JSONB,
  optional_ingredients: JSONB,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Orders

```typescript
{
  id: UUID,
  user_id: UUID (FK to auth.users),
  total: decimal,
  status: enum ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'),
  delivery_address: string,
  payment_method: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Order Items

```typescript
{
  id: UUID,
  order_id: UUID (FK),
  food_item_id: UUID (FK),
  quantity: integer,
  subtotal: decimal,
  selected_sides: JSONB,
  selected_drinks: JSONB,
  selected_extras: JSONB,
  selected_ingredients: JSONB,
  customizations: JSONB,
  created_at: timestamp,
  updated_at: timestamp
}
```

## 🔒 Security

- **Supabase Authentication** for secure user management
- **Row Level Security (RLS)** policies on all tables
- **Environment variables** for sensitive configuration
- **Input validation** on all forms
- **Secure payment processing** integration ready

## 📱 Usage

### For Users

1. **Register/Login**: Create an account or sign in
2. **Browse Menu**: Select categories to view food items
3. **Customize Items**: Choose sides, drinks, and extras
4. **Add to Cart**: Review items in your cart
5. **Checkout**: Enter delivery details and payment
6. **Track Orders**: View order history and status

### For Admins

1. **Access Dashboard**: Navigate to admin dashboard
2. **View Analytics**: Check revenue and order metrics
3. **Manage Orders**: Update order statuses
4. **Manage Items**: Add, edit, or delete food items
5. **Configure Settings**: Update restaurant information

## 🚀 Deployment

### Expo Build

```bash
expo build:android
expo build:ios
```

### Web Deployment

```bash
expo build:web
```

### Render.com Deployment

1. Create a Render account
2. Connect your GitHub repository
3. Configure build and start commands
4. Deploy

## 🎯 Key Features Implementation

### Authentication Flow

- Email/password registration with profile setup
- Secure login with session management
- Profile updates with image upload
- Password reset functionality

### Order Management

- Real-time order status updates
- Order history with filtering
- Detailed order information
- Order tracking

### Cart System

- Add/remove items
- Update quantities
- Calculate totals with tax and delivery
- Persistent cart state

### Admin Dashboard

- Revenue analytics with charts
- Top-selling items
- Order status distribution
- Food item management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ✅ Recent Updates (January 2026)

### Fixed Issues
- ✅ Registration UI/UX with validation
- ✅ Login UI/UX with error handling
- ✅ Staff Entry button label
- ✅ Fixed navigation bar on all screens
- ✅ Clickable logo redirects to home
- ✅ Order notes support
- ✅ Cancelled order status
- ✅ Payment method display
- ✅ Admin dashboard improvements
- ✅ Responsive design updates
- ✅ Payment gateway integration (Stripe)
- ✅ Location-based restaurant discovery

### New Features
- ✅ Payment Gateway (Stripe, EFT, Cash)
- ✅ Location Services (Nearby Restaurants)
- ✅ Order Notes
- ✅ Cancelled Order Status
- ✅ Payment Method Display
- ✅ Improved Admin Dashboard
- ✅ Better Error Handling
- ✅ Enhanced Validation

## 🎯 Future Enhancements

- [ ] Real-time order tracking with maps
- [ ] Push notifications for order updates
- [ ] Rating and review system
- [ ] Loyalty program
- [ ] Multiple restaurant support
- [ ] Advanced analytics dashboard
- [ ] Social login options (Google, Facebook)
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Driver tracking
- [ ] Estimated delivery time
- [ ] Order history export

## 📞 Contact

For questions or support, please open an issue on GitHub or contact the development team.

## 📖 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Complete setup instructions
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Detailed implementation notes
- [Requirements Checklist](./REQUIREMENTS_CHECKLIST.md) - Feature checklist

## 🎨 Design Resources

### Figma Design
[Link to Figma design file - to be added]

### Color Palette
- Primary: #11181C
- Secondary: #6b7280
- Accent: #3b82f6
- Success: #10b981
- Warning: #f59e0b
- Error: #ef4444

### Typography
- Font Family: System Font (SF Pro Display)
- Headings: 24px Bold
- Body: 14-16px Regular
- Small: 12px Regular

---

**Built with ❤️ using React Native and Supabase**
