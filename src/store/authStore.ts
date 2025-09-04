import { create } from 'zustand';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session && data.user) {
        // Create or update user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile error:', profileError);
        }

        const userData: User = {
          email: data.user.email || '',
          name: profile?.name || '사용자',
          dept: profile?.dept || '개발팀',
          building: profile?.building || '판교오피스',
          workArea: profile?.work_area || '',
          phone: profile?.phone || '',
          car: profile?.car_number || '',
          isAdmin: false,
          adminLevel: null
        };

        set({ user: userData, session: data.session, isLoading: false });
      }
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
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: userData.name,
            dept: userData.dept,
            building: userData.building
          }
        }
      });

      if (error) throw error;

      if (data.session && data.user) {
        const userProfile: User = {
          email: userData.email,
          name: userData.name || '사용자',
          dept: userData.dept || '개발팀',
          building: userData.building || '판교오피스',
          workArea: userData.workArea || '',
          phone: userData.phone || '',
          car: userData.car || '',
          isAdmin: false,
          adminLevel: null
        };

        set({ user: userProfile, session: data.session, isLoading: false });
      } else {
        set({ isLoading: false });
      }
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
      const { session } = get();
      if (!session?.user) throw new Error('로그인이 필요합니다.');

      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          dept: profileData.dept,
          building: profileData.building,
          work_area: profileData.workArea,
          phone: profileData.phone,
          car_number: profileData.car
        })
        .eq('user_id', session.user.id);

      if (error) throw error;

      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...profileData };
        set({ user: updatedUser, isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '프로필 업데이트에 실패했습니다.',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: () => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
        if (session?.user) {
          // Get user profile from database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          const userData: User = {
            email: session.user.email || '',
            name: profile?.name || '사용자',
            dept: profile?.dept || '개발팀',
            building: profile?.building || '판교오피스',
            workArea: profile?.work_area || '',
            phone: profile?.phone || '',
            car: profile?.car_number || '',
            isAdmin: false,
            adminLevel: null
          };

          set({ user: userData, session, isLoading: false });
        } else {
          set({ user: null, session: null, isLoading: false });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // This will trigger the auth state change listener above
        console.log('Found existing session');
      } else {
        set({ user: null, session: null, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }
}));