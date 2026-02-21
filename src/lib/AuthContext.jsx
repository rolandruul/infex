import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { signIn as storeSignIn, signUp as storeSignUp, signOut as storeSignOut } from './store';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email, password) {
    await storeSignIn(email, password);
  }

  async function signUp(email, password) {
    await storeSignUp(email, password);
  }

  async function signOut() {
    await storeSignOut();
  }

  const value = {
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isLoggedIn: !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
