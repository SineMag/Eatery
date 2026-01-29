# Eatery - React Native Restaurant App - Setup & Completion Guide

## 🎯 Project Status

This is a fully functional React Native restaurant ordering application with the following features implemented:

### ✅ Completed Features

#### User Features
- ✅ Email/Password Registration with validation
- ✅ Email/Password Login
- ✅ User Profile Management
- ✅ Browse Food Menus by Categories
- ✅ View Food Item Details
- ✅ Add Items to Cart with Customizations
- ✅ View and Manage Cart
- ✅ Remove Items from Cart
- ✅ Clear Cart
- ✅ Checkout Process
- ✅ Order Placement
- ✅ Order History & Tracking
- ✅ Payment Method Selection (Card, EFT, Cash)
- ✅ Delivery Address Management
- ✅ Order Notes Support
- ✅ Fixed Navigation Bar (All Screens)
- ✅ Clickable Logo (Redirects to Home)
- ✅ Responsive Design (Mobile, Tablet, Desktop)

#### Admin/Staff Features
- ✅ Staff Entry (Login)
- ✅ Admin Dashboard with Analytics
- ✅ Revenue Charts & Metrics
- ✅ Order Management
- ✅ View Order Details with Notes
- ✅ Order Status Management (Pending, Confirmed, Preparing, Ready, Delivered, Cancelled)
- ✅ Food Item Management (Add, Edit, Delete)
- ✅ Top Selling Items Analytics
- ✅ Order Status Distribution
- ✅ Payment Method Display (Card, EFT, Cash)
- ✅ Settings Management
- ✅ Logout Functionality

#### Technical Features
- ✅ Supabase Authentication
- ✅ Real-time Database
- ✅ Location-based Restaurant Discovery
- ✅ Payment Gateway Integration (Stripe Ready)
- ✅ Error Handling & Validation
- ✅ Loading States
- ✅ Responsive UI/UX
- ✅ Dark/Light Theme Support
- ✅ TypeScript Type Safety

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Expo CLI
- Supabase Account
- Stripe Account (Optional, for payment processing)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/SineMag/Eatery.git
cd Eatery
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
```

4. **Start the development server**
```bash
npm start
```

5. **Run on your device**
- Press `i` for iOS
- Press `a` for Android
- Press `w` for Web

## 📱 User Registration & Login

### Registration
1. Click "Register" on the landing page
2. Fill in all required fields:
   - First Name
   - Last Name
   - Email Address
   - Contact Number
   - Delivery Address
   - Password (min 6 characters, must contain letters)
   - Confirm Password
3. Click "Sign Up"
4. You'll be redirected to the home screen

### Login
1. Click "Sign In" on the landing page
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the home screen

### Staff Entry
1. Click "Staff Entry" on the landing page
2. Enter Staff ID, Full Name, and Password
3. Click "Sign In"
4. You'll be redirected to the admin dashboard

## 🛒 Shopping Flow

### Browse Restaurants
1. On the home screen, scroll to see nearby restaurants
2. Click on a restaurant to view its menu

### Browse Menu
1. Select a category (Mains, Starters, Desserts, etc.)
2. View food items with images, descriptions, and prices

### Add to Cart
1. Click on a food item
2. Customize your order:
   - Select sides (if available)
   - Choose drinks (if available)
   - Add extras (if available)
   - Remove/add ingredients (if available)
   - Set quantity
3. Click "Add to Cart"

### Manage Cart
1. Click the cart icon in the header
2. View all items in your cart
3. Adjust quantities
4. Remove individual items
5. Clear entire cart
6. Click "Proceed to Checkout"

### Checkout
1. Review your order
2. Select/change delivery address
3. Select payment method:
   - Card (Stripe)
   - EFT (Electronic Funds Transfer)
   - Cash on Delivery
4. Click "Place Order"

### Order Tracking
1. Go to "Orders" tab
2. View all your orders
3. Check order status:
   - Pending
   - Confirmed
   - Preparing
   - Ready
   - Delivered
   - Cancelled

## 👨‍💼 Admin Dashboard

### Access Admin Dashboard
1. Click "Staff Entry" on the landing page
2. Use staff credentials to login
3. You'll see the admin dashboard

### Dashboard Tabs

#### Overview
- Total Orders
- Total Revenue
- Customer Count
- Average Order Value
- This Month Statistics
- Revenue by Day Chart
- Top Selling Items
- Order Status Distribution

#### Orders
- View all recent orders
- Click on order status to see details
- View customer information
- See payment method
- View order notes
- Click "View" to see full details

#### Items
- View all food items
- Add new items
- Edit existing items
- Delete items

#### Settings
- View restaurant information
- Edit restaurant settings
- Change password
- Logout

## 💳 Payment Methods

### Card Payment
- Integrated with Stripe
- Supports all major credit/debit cards
- Secure payment processing

### EFT (Electronic Funds Transfer)
- Direct bank transfer
- Order placed with pending payment status

### Cash on Delivery
- Pay when order is delivered
- Order placed with pending payment status

## 🗺️ Location Services

### Enable Location
1. When you first open the app, you'll be prompted to allow location access
2. Grant permission to see nearby restaurants
3. Restaurants are sorted by distance

### Manual Address Entry
1. You can manually enter your delivery address during checkout
2. Address is saved to your profile for future orders

## 🔒 Security Features

- Supabase Authentication (Secure)
- Row Level Security (RLS) on database
- Password validation (min 6 chars, must contain letters)
- Email validation
- Secure payment processing
- User data encryption

## 📊 Database Schema

### Users (Supabase Auth)
- Email
- Password (hashed)
- Created at

### User Profiles
- Name
- Surname
- Contact Number
- Address
- Profile Image
- Role (user/admin)

### Restaurants
- Name
- Description
- Image URL
- Rating
- Address
- Phone

### Food Items
- Name
- Description
- Price
- Image URL
- Category
- Restaurant
- Sides, Drinks, Extras, Ingredients

### Orders
- User ID
- Items
- Total
- Status
- Delivery Address
- Payment Method
- Notes
- Created At

### Order Items
- Order ID
- Food Item ID
- Quantity
- Customizations
- Subtotal

## 🎨 UI/UX Features

### Responsive Design
- Mobile (320px - 480px)
- Tablet (481px - 768px)
- Desktop (769px+)

### Navigation
- Fixed header with logo and cart
- Fixed bottom navigation bar
- Clickable logo redirects to home
- Back button on detail screens

### Visual Feedback
- Loading indicators
- Error messages
- Success notifications
- Disabled states
- Active states

## 🐛 Troubleshooting

### Registration Not Working
1. Check email format
2. Ensure password meets requirements
3. Check Supabase connection
4. Check browser console for errors

### Login Issues
1. Verify email and password
2. Check Supabase authentication
3. Clear app cache and try again

### Cart Not Saving
1. Check local storage
2. Verify cart context is working
3. Check browser console for errors

### Location Not Working
1. Grant location permission
2. Check device location settings
3. Ensure GPS is enabled

### Payment Issues
1. Check Stripe configuration
2. Verify payment details
3. Check network connection

## 📝 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login user
- `POST /auth/signout` - Logout user

### Restaurants
- `GET /restaurants` - Get all restaurants
- `GET /restaurants/:id` - Get restaurant details
- `GET /restaurants/nearby` - Get nearby restaurants

### Food Items
- `GET /food-items` - Get all food items
- `GET /food-items/:id` - Get food item details
- `GET /food-items/category/:categoryId` - Get items by category

### Orders
- `POST /orders` - Create new order
- `GET /orders/:userId` - Get user orders
- `GET /orders/:orderId` - Get order details
- `PUT /orders/:orderId` - Update order status

### User Profile
- `GET /profile/:userId` - Get user profile
- `PUT /profile/:userId` - Update user profile
- `POST /profile/:userId/image` - Upload profile image

## 🚀 Deployment

### Expo Build
```bash
expo build:android
expo build:ios
expo build:web
```

### Render.com Deployment
1. Connect GitHub repository
2. Configure build command: `npm run build`
3. Configure start command: `npm start`
4. Deploy

### Firebase Hosting
```bash
firebase deploy
```

## 📚 Documentation

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 👥 Support

For issues and questions:
- Open an issue on GitHub
- Contact the development team
- Check documentation

## 🎯 Future Enhancements

- [ ] Real-time order tracking with maps
- [ ] Push notifications
- [ ] Rating and review system
- [ ] Loyalty program
- [ ] Multiple restaurant support
- [ ] Advanced analytics
- [ ] Social login
- [ ] Offline mode
- [ ] Multi-language support
- [ ] Driver tracking

## 📞 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ using React Native, Expo, and Supabase**

Last Updated: January 2026
