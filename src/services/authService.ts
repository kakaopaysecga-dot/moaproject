import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class AuthService {
  static async login(email: string, password: string): Promise<User> {
    if (!email.endsWith('@kakaopaysec.com')) {
      throw new Error('카카오페이증권 이메일(@kakaopaysec.com)만 사용 가능합니다.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('로그인에 실패했습니다.');
    }

    const profile = await this.getProfile(data.user.id);
    return profile;
  }

  static async signup(userData: Partial<User> & { email: string; password: string }): Promise<User> {
    const { email, password, ...rest } = userData;

    if (!email.endsWith('@kakaopaysec.com')) {
      throw new Error('카카오페이증권 이메일(@kakaopaysec.com)만 사용 가능합니다.');
    }

    const emailPrefix = email.split('@')[0];
    if (!emailPrefix.includes('.')) {
      throw new Error('이메일 형식이 올바르지 않습니다. (firstname.lastname 형식)');
    }

    const [firstName, lastName] = emailPrefix.split('.');
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: rest.name || `${firstName}.${lastName}`,
          englishName: rest.englishName || `${firstName} ${lastName}`,
          dept: rest.dept || '개발팀',
          building: rest.building || '판교오피스',
          workArea: rest.workArea || '',
          phone: rest.phone || '010-0000-0000',
          car_number: rest.car || '',
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('회원가입에 실패했습니다.');
    }

    // Wait for profile to be created by trigger
    await new Promise(resolve => setTimeout(resolve, 1000));
    const profile = await this.getProfile(data.user.id);
    return profile;
  }

  static async updateProfile(profileData: Partial<User>): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        name: profileData.name,
        dept: profileData.dept,
        building: profileData.building,
        work_area: profileData.workArea,
        phone: profileData.phone,
        car_number: profileData.car,
      })
      .eq('user_id', user.id);

    if (error) {
      throw new Error('프로필 업데이트에 실패했습니다.');
    }

    return this.getProfile(user.id);
  }

  static async getProfile(userId: string): Promise<User> {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('프로필을 찾을 수 없습니다.');
    }

    // Get user role
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    const isAdmin = userRole?.role === 'admin';

    return {
      email: profile.email,
      name: profile.name,
      englishName: profile.english_name || '',
      dept: profile.dept,
      building: profile.building,
      workArea: profile.work_area || '',
      phone: profile.phone || '',
      car: profile.car_number || '',
      isAdmin,
      adminLevel: isAdmin ? 'part' : null
    };
  }

  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    try {
      return await this.getProfile(user.id);
    } catch {
      return null;
    }
  }

  static async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  static async isAuthenticated(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }
}