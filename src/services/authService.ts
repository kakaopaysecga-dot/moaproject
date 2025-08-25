import { User } from '@/types';
import { StorageService, STORAGE_KEYS } from './storage';

export class AuthService {
  private static testUser: User = {
    email: '1',
    name: 'Master.Admin',
    dept: '총무팀',
    building: '판교오피스',
    phone: '010-1234-5678',
    car: '11가1111',
    isAdmin: true,
    adminLevel: 'supreme'
  };

  static async login(email: string, password: string): Promise<User> {
    // Test account
    if (email === '1' && password === '1') {
      StorageService.set(STORAGE_KEYS.USER, this.testUser);
      return this.testUser;
    }

    // Regular account validation
    if (!email.endsWith('@kakaopaysec.com')) {
      throw new Error('카카오페이증권 이메일(@kakaopaysec.com)만 사용 가능합니다.');
    }

    const emailPrefix = email.split('@')[0];
    if (!emailPrefix.includes('.')) {
      throw new Error('이메일 형식이 올바르지 않습니다. (firstname.lastname 형식)');
    }

    // Mock user creation for regular accounts
    const [firstName, lastName] = emailPrefix.split('.');
    const user: User = {
      email,
      name: `${firstName}.${lastName}`,
      dept: '개발팀', // Default department
      building: '판교오피스',
      phone: '010-0000-0000',
      car: '',
      isAdmin: emailPrefix.startsWith('admin'),
      adminLevel: emailPrefix.startsWith('admin') ? 'part' : null
    };

    StorageService.set(STORAGE_KEYS.USER, user);
    return user;
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
    const user: User = {
      email,
      name: rest.name || `${firstName}.${lastName}`,
      dept: rest.dept || '개발팀',
      building: rest.building || '판교오피스',
      phone: rest.phone || '010-0000-0000',
      car: rest.car || '',
      isAdmin: emailPrefix.startsWith('admin'),
      adminLevel: emailPrefix.startsWith('admin') ? 'part' : null
    };

    StorageService.set(STORAGE_KEYS.USER, user);
    return user;
  }

  static getCurrentUser(): User | null {
    return StorageService.get<User>(STORAGE_KEYS.USER);
  }

  static logout(): void {
    StorageService.remove(STORAGE_KEYS.USER);
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}