import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user || null);
      } catch (err) {
        // Handle invalid refresh token errors by clearing stale session data
        if (err instanceof Error && (
          err.message.includes('Invalid Refresh Token') ||
          err.message.includes('session_id claim in JWT does not exist') ||
          err.message.includes('refresh_token_not_found')
        )) {
          console.warn('Stale session detected, clearing authentication state');
          // Clear stale session data
          await supabase.auth.signOut();
          setUser(null);
          // Don't set error state for expected token expiration
        } else {
          console.error('Error getting session:', err);
          setError(err instanceof Error ? err.message : 'Failed to get session');
        }
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error signing in:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      return null;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      
      // Check if user is already logged out locally
      if (!user) {
        // User is already considered logged out, no need to call signOut
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        // Handle session-related errors gracefully (user is effectively already logged out)
        if (error.message.includes('Auth session missing!') || 
            error.message.includes('Session from session_id claim in JWT does not exist') ||
            error.message.includes('refresh_token_not_found')) {
          console.warn('Session already expired, user effectively logged out');
          setUser(null);
          return;
        }
        throw error;
      }
    } catch (err) {
      // Handle the case where session doesn't exist on server (user already logged out)
      if (err instanceof Error && (
        err.message.includes('Session from session_id claim in JWT does not exist') ||
        err.message.includes('Auth session missing!') ||
        err.message.includes('refresh_token_not_found')
      )) {
        console.warn('Session already expired on server, user effectively logged out');
        setUser(null);
        // Don't set error state as this is expected behavior
        return;
      }
      
      // Handle other unexpected errors
      console.error('Error signing out:', err);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error signing up:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      return null;
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    signUp,
    isAuthenticated: !!user
  };
};

export default useAuth;