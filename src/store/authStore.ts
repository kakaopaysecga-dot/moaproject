import { create } from 'zustand';
import { User } from '@/types';
import { AuthService } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User> & { email: string; password: string }) => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.login(email, password);
      set({ user, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '로그인에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.signup(userData);
      set({ user, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '회원가입에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.updateProfile(profileData);
      set({ user, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '프로필 업데이트에 실패했습니다.',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    await AuthService.logout();
    set({ user: null, session: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: () => {
    // Set up auth state listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      set({ session });
      
      if (session?.user) {
        try {
          const user = await AuthService.getProfile(session.user.id);
          set({ user, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          set({ user: null, isLoading: false });
        }
      } else {
        set({ user: null, isLoading: false });
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session });
      
      if (session?.user) {
        AuthService.getProfile(session.user.id).then((user) => {
          set({ user, isLoading: false });
        }).catch(() => {
          set({ user: null, isLoading: false });
        });
      } else {
        set({ isLoading: false });
      }
    });
  }
}));