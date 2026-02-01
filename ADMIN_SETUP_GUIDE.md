# Admin Authentication Setup Guide

## Overview
The Eatery app now has a complete admin authentication system with role-based access control. Admins can access a protected dashboard with analytics, order management, and food item management.

## How Admin Login Works

### 1. **Role-Based Authentication**
- Users are assigned a `role` field in their profile: either `"user"` or `"admin"`
- The authentication context (`useAuth`) provides an `isAdmin` boolean flag
- Admin routes are protected and automatically redirect non-admin users

### 2. **Admin Login Process**

**Admins use the same login page as regular users:**
1. Navigate to the app
2. Click "Sign In" 
3. Enter admin email and password
4. The system automatically detects admin role and grants access

**Admin Dashboard Access:**
- After login, admins will see an "Admin Dashboard" option in Settings
- Clicking it navigates to `/admin/dashboard`
- Non-admin users will NOT see this option

### 3. **Creating an Admin User**

#### Option A: Via Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **user_profiles**
3. Find the user you want to make an admin
4. Edit their row and set `role = 'admin'`
5. Save changes

#### Option B: Via SQL Query
Run this SQL query in Supabase SQL Editor:

```sql
-- Make a specific user an admin by email
UPDATE user_profiles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'admin@eatery.com'
);
```

#### Option C: During Registration
Manually insert the role when creating the profile:

```sql
INSERT INTO user_profiles (user_id, name, surname, contact_number, address, role)
VALUES (
  'user-uuid-here',
  'Admin',
  'User',
  '+1234567890',
  '123 Admin Street',
  'admin'
);
```

### 4. **Database Schema Update**

Add the `role` column to your `user_profiles` table:

```sql
-- Add role column if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' 
CHECK (role IN ('user', 'admin'));

-- Create index for faster role queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
```

## Admin Features

Once logged in as an admin, you have access to:

### **Dashboard Overview**
- Total orders, revenue, and customers
- Average order value
- Monthly statistics
- Revenue by day chart
- Top-selling items
- Order status distribution

### **Order Management**
- View all orders
- Filter by status
- Update order status
- View order details

### **Food Item Management**
- View all menu items
- Add new items
- Edit existing items
- Delete items
- View sales statistics

### **Restaurant Settings**
- Update restaurant information
- Manage contact details
- Configure business settings

## Security Features

### **Route Protection**
- Admin routes check authentication on mount
- Automatic redirect for unauthorized access
- Loading state while verifying permissions

### **Role Verification**
- Role is verified on every app launch
- Role changes take effect immediately after database update
- Secure role storage in Supabase

### **Access Control**
- Admin dashboard menu only visible to admins
- Protected API endpoints (implement server-side)
- Audit trail for admin actions (recommended to implement)

## Testing Admin Access

### **Test User Setup**
1. Create a test admin user:
   ```sql
   -- Insert test admin
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
   VALUES ('admin@eatery.com', crypt('admin123', gen_salt('bf')), NOW());
   
   -- Get the user ID and create profile
   INSERT INTO user_profiles (user_id, name, surname, contact_number, address, role)
   SELECT id, 'Test', 'Admin', '+1234567890', '123 Admin St', 'admin'
   FROM auth.users WHERE email = 'admin@eatery.com';
   ```

2. Login with: `admin@eatery.com` / `admin123`

### **Verification Steps**
1. ✅ Login as admin user
2. ✅ Navigate to Settings
3. ✅ Verify "Admin Dashboard" option appears
4. ✅ Click and access dashboard
5. ✅ Logout and login as regular user
6. ✅ Verify "Admin Dashboard" option is hidden
7. ✅ Try accessing `/admin/dashboard` directly (should redirect)

## Common Issues & Solutions

### **"Access Denied" Message**
- **Cause**: User doesn't have admin role
- **Solution**: Update user's role in Supabase to 'admin'

### **Admin Menu Not Appearing**
- **Cause**: Role not set in database or app not fetching profile
- **Solution**: 
  1. Check `user_profiles.role` in Supabase
  2. Verify profile fetch in `useAuth` hook
  3. Restart the app to reload auth state

### **Admin Dashboard Shows Loading Forever**
- **Cause**: Auth hook not resolving
- **Solution**: Check Supabase connection and ensure `getUserProfile` works

### **Changes Not Taking Effect**
- **Cause**: Cached auth state
- **Solution**: 
  1. Logout completely
  2. Close and restart the app
  3. Login again

## Best Practices

### **Security**
- ✅ Never expose admin credentials in code
- ✅ Use environment variables for sensitive data
- ✅ Implement server-side role verification for API calls
- ✅ Add audit logging for admin actions
- ✅ Use strong passwords for admin accounts

### **User Management**
- ✅ Limit number of admin users
- ✅ Document which emails have admin access
- ✅ Regularly review admin user list
- ✅ Remove admin access when no longer needed

### **Development**
- ✅ Test both admin and regular user flows
- ✅ Verify route protection works
- ✅ Check role changes reflect immediately
- ✅ Ensure admin UI is only visible to admins

## Future Enhancements

Consider implementing:
- [ ] Multiple admin roles (super admin, moderator, etc.)
- [ ] Admin action audit log
- [ ] Admin user management interface
- [ ] Two-factor authentication for admins
- [ ] Admin activity monitoring
- [ ] Permission-based access control
- [ ] Admin invitation system

## Support

If you encounter issues:
1. Check Supabase logs for authentication errors
2. Verify database schema matches this guide
3. Review browser console for error messages
4. Ensure environment variables are set correctly

---

**Important**: Always test admin functionality in development before deploying to production!
