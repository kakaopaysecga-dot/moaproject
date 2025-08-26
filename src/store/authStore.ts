import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  dept: string;
  building: string;
  work_area?: string;
  phone?: string;
  car_number?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  
  signUp: (userData: {
    email: string;
    password: string;
    name: string;
    dept: string;
    building: string;
    work_area?: string;
    phone?: string;
    car_number?: string;
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  error: null,

  signUp: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: userData.name,
            dept: userData.dept,
            building: userData.building,
            work_area: userData.work_area,
            phone: userData.phone,
            car_number: userData.car_number,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile in database
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            email: userData.email,
            name: userData.name,
            dept: userData.dept,
            building: userData.building,
            work_area: userData.work_area,
            phone: userData.phone,
            car_number: userData.car_number,
          });

        if (profileError) throw profileError;
      }

      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '회원가입에 실패했습니다.',
        isLoading: false 
      });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '로그인에 실패했습니다.',
        isLoading: false 
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null, profile: null, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '로그아웃에 실패했습니다.' });
    }
  },

  updateProfile: async (profileData) => {
    const { session } = get();
    if (!session?.user) throw new Error('사용자가 인증되지 않았습니다.');

    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', session.user.id);

      if (error) throw error;

      // Fetch updated profile
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      set({ profile: updatedProfile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '프로필 업데이트에 실패했습니다.',
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  initialize: async () => {
    // Set up auth state change listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      set({ session, user: session?.user ?? null });
      
      if (session?.user) {
        // Fetch user profile
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            set({ profile });
          } catch (error) {
            console.error('Failed to fetch profile:', error);
          }
        }, 0);
      } else {
        set({ profile: null });
      }
    });

    // Check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null });
    
    if (session?.user) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        set({ profile });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    }
  },
}));