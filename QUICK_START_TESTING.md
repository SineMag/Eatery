# 🚀 Eatery App - Quick Start & Test Guide

## ⚡ Quick Start (2 minutes)

### 1. Install & Run
```bash
npm install
npm start
```

### 2. Choose Platform
- Press `i` for iOS
- Press `a` for Android
- Press `w` for Web

### 3. You're Ready!
The app will open in your chosen platform.

---

## 👤 User Test Credentials

### Register New Account
1. Click "Register" on landing page
2. Fill in all fields:
   - **Name**: John
   - **Surname**: Doe
   - **Email**: john@example.com
   - **Contact**: 0123456789
   - **Address**: 123 Main Street
   - **Password**: Password123 (must have uppercase, lowercase, numbers)
3. Click "Sign Up"
4. You're logged in!

### Or Use Test Account
- **Email**: test@example.com
- **Password**: password123

---

## 👨‍💼 Staff/Admin Test Credentials

### Staff Login
1. Click "Staff Entry" on landing page
2. Enter credentials:
   - **Staff ID**: ID0001
   - **Password**: Password123

### Password Requirements
✓ Lowercase letters (a-z)  
✓ Uppercase letters (A-Z)  
✓ Numbers (0-9)  
✓ Minimum 8 characters

---

## 🛒 User Flow Test

### 1. Browse Menu
- Click on a category (Mains, Starters, Desserts, etc.)
- See food items with images and prices

### 2. Add to Cart
- Click "Add" button on any item
- Item added to cart
- See cart count in header

### 3. View Cart
- Click cart icon in header
- See all items
- Can adjust quantity or remove items

### 4. Checkout
- Click "Proceed to Checkout"
- Select delivery address
- Select payment method (Card, EFT, Cash)
- Click "Pay"
- Order placed!

### 5. View Orders
- Click "Orders" in bottom navigation
- See order history
- Click order to see details

### 6. Update Profile
- Click "Profile" in bottom navigation
- Click "Edit" button
- Update information
- Click "Save Changes"

### 7. Settings
- Click "Settings" in bottom navigation
- View all options
- Can logout or delete account

---

## 👨‍💼 Admin Flow Test

### 1. Staff Login
- Click "Staff Entry" on landing page
- Enter: **ID0001** and **Password123**
- Redirected to admin dashboard

### 2. View Dashboard
- See analytics overview
- View revenue charts
- Check top selling items
- See order status distribution

### 3. Manage Orders
- Click "Orders" tab
- View all recent orders
- Click order to see details
- See customer info and notes
- See payment method

### 4. Manage Items
- Click "Items" tab
- View all food items
- Click "Add Item" to add new
- Click edit/delete icons to modify

### 5. View Settings
- Click "Settings" tab
- See restaurant information
- Can edit settings
- Can logout

### 6. Logout
- Click "Logout" button
- Redirected to home screen

---

## 🎯 Key Features to Test

### ✅ Registration
- [ ] Fill all fields
- [ ] Password validation works
- [ ] Error messages appear
- [ ] Account created successfully

### ✅ Login
- [ ] Email/password validation
- [ ] Error messages for invalid credentials
- [ ] Redirects to home on success

### ✅ Menu
- [ ] Categories display
- [ ] Food items show with images
- [ ] Prices display correctly
- [ ] Add to cart works

### ✅ Cart
- [ ] Items display
- [ ] Quantity can be adjusted
- [ ] Items can be removed
- [ ] Total calculates correctly

### ✅ Checkout
- [ ] Address selection works
- [ ] Payment method selection works
- [ ] Order can be placed
- [ ] Confirmation shows

### ✅ Orders
- [ ] Order history displays
- [ ] Order details show
- [ ] Status displays correctly

### ✅ Profile
- [ ] Profile information displays
- [ ] Can edit profile
- [ ] Changes save correctly
- [ ] Can delete account

### ✅ Settings
- [ ] All buttons visible
- [ ] Logout works
- [ ] Redirects to home

### ✅ Admin
- [ ] Staff login works
- [ ] Dashboard displays
- [ ] Orders tab shows orders
- [ ] Items tab shows items
- [ ] Settings tab accessible
- [ ] Logout works

### ✅ Logo
- [ ] Logo visible on all screens
- [ ] Logo is clickable
- [ ] Redirects to home

### ✅ Navigation
- [ ] Bottom navigation fixed
- [ ] All tabs accessible
- [ ] Navigation works smoothly

---

## 💳 Test Payment Cards

### Stripe Test Cards
- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **Amex**: 3782 822463 10005

### Card Details
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **Name**: Any name

### Other Payment Methods
- **EFT**: Select "EFT" at checkout
- **Cash**: Select "Cash on Delivery"

---

## 🐛 Troubleshooting

### App Won't Start
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm start
```

### Can't Register
- Check email format
- Password must have uppercase, lowercase, numbers
- Check Supabase connection

### Can't Login
- Verify email and password
- Check account exists
- Try registering new account

### Menu Not Showing
- Refresh page
- Check category selection
- Clear browser cache

### Cart Not Working
- Check local storage
- Refresh page
- Clear cache

### Payment Issues
- Check card details
- Use test cards
- Check internet connection

---

## 📱 Screen Sizes to Test

### Mobile
- iPhone 12 (390x844)
- iPhone SE (375x667)
- Android (360x800)

### Tablet
- iPad (768x1024)
- iPad Pro (1024x1366)

### Desktop
- 1920x1080
- 1366x768
- 1024x768

---

## 🎨 Features to Verify

### Visual
- [ ] Logo displays correctly
- [ ] Images load properly
- [ ] Colors are consistent
- [ ] Text is readable
- [ ] Buttons are clickable
- [ ] Layout is responsive

### Functional
- [ ] All buttons work
- [ ] Forms validate
- [ ] Navigation works
- [ ] Data persists
- [ ] Errors display
- [ ] Loading states show

### Performance
- [ ] App loads quickly
- [ ] Screens transition smoothly
- [ ] No lag or delays
- [ ] Images load fast
- [ ] Forms respond quickly

---

## 📋 Checklist Before Deployment

- [ ] All features tested
- [ ] All buttons working
- [ ] All screens responsive
- [ ] All validations working
- [ ] Error handling complete
- [ ] Loading states visible
- [ ] Navigation working
- [ ] Logo clickable
- [ ] Logout redirects
- [ ] Delete account works
- [ ] Menu displays
- [ ] Cart functions
- [ ] Checkout works
- [ ] Orders display
- [ ] Profile updates
- [ ] Settings accessible
- [ ] Admin dashboard works
- [ ] Staff login works
- [ ] Password validation works
- [ ] No console errors

---

## 🎯 Test Scenarios

### Scenario 1: New User
1. Register new account
2. Browse menu
3. Add items to cart
4. Checkout
5. Place order
6. View order history

### Scenario 2: Returning User
1. Login with existing account
2. View previous orders
3. Update profile
4. Browse menu
5. Add to cart
6. Checkout

### Scenario 3: Admin
1. Staff login
2. View dashboard
3. Check orders
4. Manage items
5. View settings
6. Logout

### Scenario 4: Error Handling
1. Try invalid email
2. Try weak password
3. Try invalid staff ID
4. Try invalid payment
5. Check error messages

---

## 📞 Support

### If Something Doesn't Work
1. Check error message
2. Check browser console
3. Try refreshing page
4. Clear cache and reload
5. Check documentation
6. Contact support

---

## ✅ Final Verification

Before considering the app complete:

- ✅ User can register
- ✅ User can login
- ✅ User can browse menu
- ✅ User can add to cart
- ✅ User can checkout
- ✅ User can place order
- ✅ User can view orders
- ✅ User can update profile
- ✅ User can delete account
- ✅ User can logout
- ✅ Staff can login
- ✅ Admin can view dashboard
- ✅ Admin can manage orders
- ✅ Admin can manage items
- ✅ Admin can logout
- ✅ Logo is clickable
- ✅ Navigation is fixed
- ✅ All buttons work
- ✅ Menu displays
- ✅ No errors in console

---

## 🎉 You're All Set!

The Eatery app is ready to use. Follow the quick start guide above to get started.

**Happy Testing!** 🚀

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Status**: ✅ Ready for Testing & Deployment
