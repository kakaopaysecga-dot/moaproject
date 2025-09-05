import { create } from 'zustand';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null, error: null });
    } catch (error) {
      console.error('Logout error:', error);
      set({ error: 'Logout failed' });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: () => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        set({ 
          session, 
          user: session?.user ?? null,
          isLoading: false 
        });
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ 
        session, 
        user: session?.user ?? null,
        isLoading: false 
      });
    });

    // Return cleanup function
    return () => subscription.unsubscribe();
  }
}));