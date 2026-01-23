# Google Cloud Console Setup Guide

## Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

## Step 2: Create/Select Project

1. Click project dropdown at top
2. Select existing `eatery-45672` or create new project
3. Project name: `Eatery Restaurant App`

## Step 3: Enable Required APIs

Navigate to: APIs & Services → Library
Enable these APIs:

- Firebase Authentication API
- Google Identity Toolkit API
- Firebase Rules API
- Cloud Firestore API

## Step 4: Configure API Key

1. APIs & Services → Credentials
2. Create new API key or restrict existing one
3. Add HTTP referrers:
   - `http://localhost:8081/*`
   - `https://yourdomain.com/*`
4. Restrict to enabled APIs only

## Step 5: Update Firebase Configuration

Replace the API key in utils/firebase.ts with your new key

## Step 6: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project `eatery-45672`
3. Authentication → Sign-in method
4. Enable Email/Password provider

## Step 7: Test Configuration

1. Restart your Expo app
2. Test login functionality
3. Check browser console for errors
