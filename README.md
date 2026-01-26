<img src="https://socialify.git.ci/SineMag/Eatery/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="Eatery" width="640" height="320" />

# Eatery - React Native Restaurant App

A modern React Native restaurant ordering application built with Expo, Firebase, and TypeScript. Features include user authentication, menu browsing, cart management, and order tracking.

## 🚀 Features

### User Features

- **Authentication**: Email/password registration and login with Firebase
- **Menu Browsing**: Browse food items by categories (Mains, Starters, Desserts, Beverages, Alcohol, Burgers)
- **Item Customization**: Select sides, drinks, extras, and ingredient preferences
- **Cart Management**: Add/remove items, update quantities, clear cart
- **Checkout**: Select delivery address and payment method
- **Order History**: View and track order status
- **Profile Management**: Update personal information and payment methods

### Admin Features (Planned)

- **Dashboard**: Manage food items and categories
- **Order Management**: View and process orders
- **Analytics**: Sales data and customer insights

## 🛠 Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router
- **Backend**: Firebase (Authentication, Firestore)
- **State Management**: React Context (Auth, Cart)
- **UI Components**: Expo Symbols, Custom components
- **Styling**: React Native StyleSheet with dark/light theme support
- **Icons**: Expo Symbols (SF Symbols)
- **TypeScript**: Full type safety

## 📱 Screens

### Authentication

- Login screen with email/password
- Registration with full profile details
- Profile management and updates

### Main App

- **Home**: Category grid navigation
- **Menu**: Category-specific food items
- **Item Detail**: Customization options and add to cart
- **Cart**: Item management and checkout
- **Checkout**: Address and payment selection
- **Orders**: Order history with status tracking
- **Profile**: User information and settings

## 🎨 Design

- **Color Scheme**: Dark grey, black, and white
- **Icons**: React Icons (SF Symbols via Expo Symbols)
- **Typography**: Clean, modern font hierarchy
- **Layout**: Card-based design with proper spacing
- **Responsive**: Optimized for various screen sizes

## 🔧 Setup

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI
- Firebase project setup

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

## OR

```bash
yarn install
```

3. Set up Firebase
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and create a new project
   - Enable Authentication:
     - Go to Authentication → Sign-in method
     - Enable "Email/Password" provider
   - Set up Firestore Database:
     - Go to Firestore Database → Create database
     - Choose "Start in test mode" for development
     - Select a location (preferably close to your users)
   - Get your Firebase configuration:
     - Go to Project Settings → General → Your apps
     - Copy the Firebase config object

4. Configure environment variables
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your Firebase credentials to `.env`:
     ```
     EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
     EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
     EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```
   - Replace the placeholder values with your actual Firebase config

5. Start the development server

```bash
npm start
```

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Browse Menu**: Select categories to view food items
3. **Customize Items**: Choose sides, drinks, and extras
4. **Add to Cart**: Review items in your cart
5. **Checkout**: Enter delivery details and payment
6. **Track Orders**: View order history and status

## 🔒 Security

- Firebase Authentication for secure user management
- Environment variables for sensitive configuration
- Input validation on all forms
- Secure payment processing (integration ready)

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

## 📊 Database Schema

### Users Collection

```typescript
{
  uid: string,
  email: string,
  name: string,
  surname: string,
  contactNumber: string,
  address: string,
  cardDetails?: CardDetails,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection

```typescript
{
  id: string,
  userId: string,
  items: OrderItem[],
  total: number,
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled',
  deliveryAddress: string,
  paymentMethod: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Food Items Collection

```typescript
{
  id: string,
  name: string,
  description: string,
  price: number,
  imageUrl: string,
  categoryId: string,
  sides?: Option[],
  drinks?: Option[],
  extras?: Option[],
  optionalIngredients?: Option[]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- [ ] Real-time order tracking
- [ ] Push notifications
- [ ] Rating and review system
- [ ] Loyalty program
- [ ] Multiple restaurant support
- [ ] Advanced analytics dashboard
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Social login options
- [ ] Offline mode support

## 📞 Contact

For questions or support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using React Native and Firebase**
