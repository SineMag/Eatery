l# Eatery App - Quick Reference Guide

## 🚀 Quick Start (5 minutes)

### 1. Install & Setup
```bash
git clone https://github.com/SineMag/Eatery.git
cd Eatery
npm install
```

### 2. Configure Environment
Create `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=your-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
```

### 3. Start Development
```bash
npm start
```

### 4. Run on Device
- Press `i` for iOS
- Press `a` for Android
- Press `w` for Web

## 👤 User Flow

### Registration
1. Click "Register"
2. Fill form (Name, Email, Phone, Address, Password)
3. Click "Sign Up"
4. ✅ Account created

### Login
1. Click "Sign In"
2. Enter email & password
3. Click "Sign In"
4. ✅ Logged in

### Order Food
1. Browse restaurants
2. Select restaurant
3. Choose food items
4. Customize (sides, drinks, extras)
5. Add to cart
6. Click cart icon
7. Review items
8. Click "Proceed to Checkout"
9. Select address
10. Select payment method
11. Click "Pay"
12. ✅ Order placed

### Track Order
1. Go to "Orders" tab
2. View order status
3. See delivery details

## 👨‍💼 Admin Flow

### Login
1. Click "Staff Entry"
2. Enter Staff ID, Name, Password
3. Click "Sign In"
4. ✅ In dashboard

### View Orders
1. Click "Orders" tab
2. View all orders
3. Click order to see details
4. See customer info & notes

### Manage Items
1. Click "Items" tab
2. View all items
3. Click "Add Item" to add new
4. Click edit/delete to modify

### View Analytics
1. Click "Overview" tab
2. See metrics & charts
3. View top selling items
4. Check order status

## 🔑 Test Credentials

### User Account
- Email: `test@example.com`
- Password: `password123`

### Staff Account
- Staff ID: `staff001`
- Name: `John Doe`
- Password: `password123`

## 💳 Test Payment Cards

### Stripe Test Cards
- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **Amex**: 3782 822463 10005

### Other Payment Methods
- **EFT**: Select "EFT" at checkout
- **Cash**: Select "Cash on Delivery"

## 📱 Screen Navigation

### User Screens
```
Landing Page
├── Sign In → Login Screen
├── Register → Registration Screen
└── Staff Entry → Staff Login

Home Screen
├── Categories → Menu Screen
├── Cart Icon → Cart Screen
├── Profile Icon → Profile Screen
└── Orders Tab → Orders Screen

Menu Screen
├── Food Item → Item Detail Screen
└── Add to Cart

Cart Screen
├── Checkout → Payment Screen
└── Continue Shopping

Payment Screen
├── Add Address
├── Add Card
└── Place Order

Orders Screen
├── Order Item → Order Detail Screen
└── Track Order
```

### Admin Screens
```
Staff Login
└── Admin Dashboard

Admin Dashboard
├── Overview Tab
│   ├── Metrics
│   ├── Revenue Chart
│   ├── Top Items
│   └── Order Status
├── Orders Tab
│   ├── View Orders
│   ├── View Details
│   └── Update Status
├── Items Tab
│   ├── View Items
│   ├── Add Item
│   ├── Edit Item
│   └── Delete Item
└── Settings Tab
    ├── Restaurant Info
    └── Logout
```

## 🎯 Key Features

### User Features
- ✅ Email/Password Auth
- ✅ Profile Management
- ✅ Browse Restaurants
- ✅ View Menu Items
- ✅ Customize Orders
- ✅ Cart Management
- ✅ Checkout
- ✅ Order Tracking
- ✅ Payment Methods (Card, EFT, Cash)
- ✅ Order Notes
- ✅ Fixed Navigation

### Admin Features
- ✅ Order Management
- ✅ View Order Details
- ✅ View Order Notes
- �� Update Order Status
- ✅ Food Item Management
- ✅ Analytics Dashboard
- ✅ Revenue Charts
- ✅ Top Selling Items
- ✅ Order Status Distribution
- ✅ Settings Management

## 🔧 Common Tasks

### Add a New Food Item
1. Login as staff
2. Go to "Items" tab
3. Click "Add Item"
4. Fill in details
5. Click "Save"

### Update Order Status
1. Go to "Orders" tab
2. Click on order
3. Click status button
4. Select new status
5. Confirm

### View Order Details
1. Go to "Orders" tab
2. Click "View" button
3. See all details
4. See customer notes

### Change Delivery Address
1. Go to checkout
2. Click "Add Address"
3. Fill in details
4. Click "Save Address"
5. Select address

### Add Payment Card
1. Go to checkout
2. Click "Add Card"
3. Fill in card details
4. Click "Save Card"
5. Select card

## 🐛 Troubleshooting

### Can't Register
- Check email format
- Password must be 6+ chars with letters
- Check Supabase connection

### Can't Login
- Verify email & password
- Check account exists
- Try resetting password

### Cart Not Working
- Check local storage
- Refresh page
- Clear cache

### Payment Failing
- Check card details
- Use test cards
- Check internet connection

### Location Not Working
- Grant permission
- Enable GPS
- Check location settings

## 📞 Support

- Check documentation
- Review error messages
- Check browser console
- Contact development team

## 🎨 Customization

### Change Colors
Edit `constants/theme.ts`:
```typescript
export const colors = {
  primary: '#11181C',
  secondary: '#6b7280',
  accent: '#3b82f6',
  // ...
}
```

### Change Fonts
Edit component styles:
```typescript
fontSize: 16,
fontWeight: '600',
```

### Add New Category
1. Add to database
2. Update menu screen
3. Add category image

## 📚 File Structure

```
Eatery/
├── app/                    # Screens
├── components/             # Reusable components
├── hooks/                  # Custom hooks
├── utils/                  # Utilities
├── types/                  # TypeScript types
├── constants/              # Constants
├── assets/                 # Images & fonts
└── scripts/                # Setup scripts
```

## 🚀 Deployment

### Build for Production
```bash
expo build:android
expo build:ios
expo build:web
```

### Deploy to Render
1. Connect GitHub
2. Configure build
3. Deploy

## 📖 Documentation

- [Setup Guide](./SETUP_GUIDE.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Requirements Checklist](./REQUIREMENTS_CHECKLIST.md)

## ✅ Checklist Before Deployment

- [ ] All tests passing
- [ ] Environment variables set
- [ ] Supabase configured
- [ ] Stripe configured
- [ ] Images optimized
- [ ] Error handling tested
- [ ] Payment tested
- [ ] Location tested
- [ ] Responsive design tested
- [ ] Performance optimized

## 🎯 Next Steps

1. Deploy to production
2. Set up monitoring
3. Add push notifications
4. Implement ratings
5. Add loyalty program
6. Expand to multiple restaurants

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready
