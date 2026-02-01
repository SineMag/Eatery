import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { supabase, getUserProfile } from '../utils/supabase'
import { Session } from '@supabase/supabase-js'
import { User as AppUser } from '../types' // Alias User from types/index.ts

interface AuthContextType {
  user: AppUser | null // Use the application's User type
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string, name?: string) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signUp: async () => ({ data: null, error: null }),
  signIn: async () => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const handleAuthStateChange = async (newSession: Session | null) => {
      setSession(newSession);
      if (newSession?.user) {
        const supabaseUser = newSession.user;
        const profile = await getUserProfile(supabaseUser.id); // Fetch profile from utils/supabase

        if (profile) {
          // Combine Supabase user data with our profile data
          const userRole = profile.role || 'user';
          setUser({
            uid: supabaseUser.id,
            email: supabaseUser.email || '',
            name: profile.name || '',
            surname: profile.surname || '',
            contactNumber: profile.contact_number || '',
            address: profile.address || '',
            profileImage: profile.profile_image || '',
            role: userRole,
          });
          setIsAdmin(userRole === 'admin');
        } else {
          // If no profile, use basic Supabase user info
          setUser({
            uid: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || '',
            surname: supabaseUser.user_metadata?.surname || '',
            contactNumber: '',
            address: '',
            profileImage: supabaseUser.user_metadata?.profile_image || '',
            role: 'user',
          });
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      handleAuthStateChange(newSession);
    });

    return () => subscription.unsubscribe();
  }, [])

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      },
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}