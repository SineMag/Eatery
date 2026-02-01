# Supabase Setup Guide for Eatery App

This guide will help you set up Supabase for the Eatery application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in/up for an account
4. Click "New Project"
5. Choose your organization
6. Enter project details:
   - **Project Name**: `eatery-app` (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose the closest region to your users
7. Click "Create new project"
8. Wait for the project to be set up (2-3 minutes)

## 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxxxxx.supabase.co`)
   - **anon public** API key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Set Up Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Supabase credentials:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with the actual credentials from step 2.

## 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `scripts/supabase-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:

- `food_categories` table
- `food_items` table
- `restaurants` table
- `orders` table
- `order_items` table
- `user_profiles` table
- Proper indexes and RLS policies

## 5. Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:8081` (for development)
   - **Redirect URLs**: Add your app's deep link URLs
   - **Email templates**: Customize as needed

3. Enable email/password authentication:
   - Go to **Authentication** → **Providers**
   - Ensure "Email" is enabled

## 6. Test the Setup

1. Start your development server:

   ```bash
   npm start
   ```

2. Test authentication:
   - Go to the login screen
   - Click "🔧 Test Supabase Auth" button
   - Try to create a new account
   - Verify you can login

3. Check the Supabase dashboard:
   - Go to **Authentication** → **Users** to see created users
   - Go to **Table Editor** to see data in your tables

## 7. Sample Data (Optional)

To add sample data for testing, run this in the SQL Editor:

```sql
-- Insert sample categories
INSERT INTO food_categories (name, order_num) VALUES
('Burgers', 1),
('Pizza', 2),
('Beverages', 3),
('Desserts', 4);

-- Insert sample restaurant
INSERT INTO restaurants (name, description, rating, address, phone) VALUES
('Burger Palace', 'The best burgers in town', 4.5, '123 Main St', '555-0123');

-- Insert sample food items
INSERT INTO food_items (name, description, price, image_url, category_id, restaurant_id)
SELECT
  'Classic Burger',
  'Juicy beef patty with lettuce, tomato, and our special sauce',
  12.99,
  '/assets/images/burger.jpg',
  id,
  (SELECT id FROM restaurants LIMIT 1)
FROM food_categories WHERE name = 'Burgers' LIMIT 1;
```

## Troubleshooting

### Common Issues

1. **"Invalid login credentials" error**
   - Ensure user exists in Supabase Auth
   - Check email/password are correct
   - Verify email confirmation is disabled for testing

2. **"Database relation does not exist" error**
   - Run the schema setup script (step 4)
   - Check table names match exactly

3. **CORS errors**
   - Add your development URL to CORS settings
   - Check environment variables are correctly set

4. **RLS (Row Level Security) issues**
   - Ensure policies are correctly set up
   - Check user is authenticated before accessing protected data

### Debug Tips

- Check browser console for detailed error messages
- Use Supabase dashboard to verify data
- Test queries directly in SQL Editor
- Check network requests in browser dev tools

## Next Steps

Once Supabase is set up:

1. Add real food items and categories
2. Configure payment integration
3. Set up proper email templates
4. Add storage for food images
5. Configure production environment variables

## Support

- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Discord: [https://discord.gg/supabase](https://discord.gg/supabase)
- GitHub Issues: Report issues in this repository
