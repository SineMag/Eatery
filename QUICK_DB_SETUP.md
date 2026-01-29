# 🚀 Quick Database Setup Guide

## ⚡ 5-Minute Setup

### **Step 1: Copy the SQL**

Go to: `scripts/complete-schema.sql` in your project

Copy ALL the content (the entire file)

### **Step 2: Run in Supabase**

1. Open [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Paste the SQL
6. Click **Run** button

### **Step 3: Wait for Success**

You should see: ✅ "Success" message

### **Step 4: Verify Tables**

1. Click **Table Editor** (left sidebar)
2. You should see these tables:
   - user_profiles
   - food_categories
   - restaurants
   - food_items
   - orders
   - order_items
   - staff_profiles

### **Step 5: Test the App**

1. Go back to your app
2. Click **Register**
3. Use any email: `test@example.com`
4. Password: `Password123`
5. Fill other fields
6. Click **Sign Up** ✅

---

## ❌ If You Get Errors

### **Error: "table already exists"**
- This is OK! It means the table was already created
- Just continue

### **Error: "Could not find table"**
- The SQL didn't run properly
- Try running it again
- Make sure you copied the ENTIRE file

### **Error: "permission denied"**
- Check your Supabase project permissions
- Make sure you're logged in as project owner

---

## 📊 What Gets Created

| Table | Purpose |
|-------|---------|
| user_profiles | User account data |
| food_categories | Menu categories |
| restaurants | Restaurant info |
| food_items | Menu items |
| orders | Customer orders |
| order_items | Items in orders |
| staff_profiles | Staff accounts |

---

## 🎯 That's It!

Your database is now ready. The app will work immediately after this setup.

**No cart or menu tables needed** - they're stored locally in the app.

---

## 📞 Still Having Issues?

1. Check all 7 tables exist in Table Editor
2. Verify the SQL ran without errors
3. Try refreshing your app
4. Clear browser cache
5. Try registering with a different email

---

**You're all set!** 🎉
