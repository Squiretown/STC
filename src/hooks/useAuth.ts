import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

const STALE_SESSION_ERRORS = [
  'Invalid Refresh Token',
  'session_id claim in JWT does not exist',
  'refresh_token_not_found',
  'Auth session missing!',
];

const isStaleSessionError = (msg: string) =>
  STALE_SESSION_ERRORS.some(e => msg.includes(e));

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAdmin = async (u: User | null) => {
    if (!u) { setIsAdmin(false); return; }
    try {
      const { data } = await supabase.rpc('is_admin');
      setIsAdmin(!!data);
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user || null);
        await checkAdmin(session?.user || null);
      } catch (err) {
        if (err instanceof Error && isStaleSessionError(err.message)) {
          console.warn('Stale session, clearing');
          await supabase.auth.signOut();
          setUser(null);
          setIsAdmin(false);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to get session');
        }
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      await checkAdmin(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      return null;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      if (!user) return;
      const { error } = await supabase.auth.signOut();
      if (error && !isStaleSessionError(error.message)) throw error;
      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      if (err instanceof Error && isStaleSessionError(err.message)) {
        setUser(null);
        setIsAdmin(false);
        return;
      }
      console.error('Error signing out:', err);
    }
  };

  return {
    user,
    loading,
    error,
    isAdmin,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
};

export default useAuth;
