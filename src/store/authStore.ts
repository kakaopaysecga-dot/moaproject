import { create } from 'zustand';
import { User } from '@/types';
import { AuthService } from '@/services/authService';

interface AuthState {
  user: User | null;
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
    set({ user: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: () => {
    // 더미 데이터 기반이므로 로컬스토리지에서 현재 사용자를 확인
    const initializeUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        set({ user, isLoading: false });
      } catch (error) {
        set({ user: null, isLoading: false });
      }
    };

    initializeUser();
  }
}));