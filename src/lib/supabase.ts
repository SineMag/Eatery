import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://lmmlmkbtwsuwvvgzjxqb.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtbWxta2J0d3N1d3Z2Z3pqeHFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2Njc5ODksImV4cCI6MjA4NTI0Mzk4OX0.JGzBnuDSnXVPP3sb_cKeQy6_f8WPh8zRESAFumxEf2g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
