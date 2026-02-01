import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/utils/supabase';

export type StaffUser = {
  authUserId: string;
  email: string;
  staffId: string;
  fullName: string;
  role: 'staff' | 'admin';
  acceptingOrders: boolean;
};

type StaffAuthContextType = {
  staff: StaffUser | null;
  loading: boolean;
  signInWithStaffCredentials: (staffId: string, fullName: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  setAcceptingOrders: (accepting: boolean) => Promise<void>;
};

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

export function StaffAuthProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const authUser = data.session?.user || null;
      if (authUser) {
        // fetch staff profile for this auth user
        const { data: sp, error } = await supabase
          .from('staff_profiles')
          .select('*')
          .eq('auth_user_id', authUser.id)
          .eq('active', true)
          .single();
        if (!error && sp) {
          setStaff({
            authUserId: sp.auth_user_id,
            email: sp.email,
            staffId: sp.staff_id,
            fullName: sp.full_name,
            role: sp.role,
            acceptingOrders: sp.accepting_orders,
          });
        } else {
          setStaff(null);
        }
      } else {
        setStaff(null);
      }
      setLoading(false);
    };

    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) {
        setStaff(null);
        return;
      }
      supabase
        .from('staff_profiles')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .eq('active', true)
        .single()
        .then(({ data: sp }) => {
          if (sp) {
            setStaff({
              authUserId: sp.auth_user_id,
              email: sp.email,
              staffId: sp.staff_id,
              fullName: sp.full_name,
              role: sp.role,
              acceptingOrders: sp.accepting_orders,
            });
          } else {
            setStaff(null);
          }
        });
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithStaffCredentials = async (staffId: string, fullName: string, password: string) => {
    if (!staffId || !fullName || !password) return { error: 'Please fill in all fields.' };

    // Lookup staff by staff_id + full_name
    const { data: sp, error: spErr } = await supabase
      .from('staff_profiles')
      .select('*')
      .eq('staff_id', staffId.trim())
      .eq('full_name', fullName.trim())
      .eq('active', true)
      .single();

    if (spErr || !sp) return { error: 'Staff record not found or inactive.' };

    // Sign in using the staff email
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: sp.email,
      password,
    });
    if (authErr || !authData.session?.user) return { error: 'Invalid credentials.' };

    // Load profile to context
    setStaff({
      authUserId: sp.auth_user_id,
      email: sp.email,
      staffId: sp.staff_id,
      fullName: sp.full_name,
      role: sp.role as 'staff' | 'admin',
      acceptingOrders: sp.accepting_orders,
    });
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setStaff(null);
  };

  const setAcceptingOrders = async (accepting: boolean) => {
    if (!staff) return;
    const { error } = await supabase
      .from('staff_profiles')
      .update({ accepting_orders: accepting })
      .eq('auth_user_id', staff.authUserId);
    if (!error) setStaff({ ...staff, acceptingOrders: accepting });
  };

  const value = useMemo(() => ({ staff, loading, signInWithStaffCredentials, signOut, setAcceptingOrders }), [staff, loading]);
  return <StaffAuthContext.Provider value={value}>{children}</StaffAuthContext.Provider>;
}

export function useStaffAuth() {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) throw new Error('useStaffAuth must be used within StaffAuthProvider');
  return ctx;
}
