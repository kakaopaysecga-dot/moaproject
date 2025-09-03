import { User } from '@/types';

// 더미 데이터베이스 (로컬스토리지 사용)
const USERS_KEY = 'moa_users';
const CURRENT_USER_KEY = 'moa_current_user';

// 더미 사용자 목록 가져오기
const getUsers = (): Array<User & { password: string }> => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [
    {
      email: '1',
      password: '1',
      name: '테스트 관리자',
      englishName: 'Test Admin',
      dept: '개발팀',
      building: '판교오피스',
      workArea: '실리콘밸리',
      phone: '010-1234-5678',
      car: '11가1111',
      isAdmin: true,
      adminLevel: 'part' as const
    }
  ];
};

// 사용자 목록 저장
const saveUsers = (users: Array<User & { password: string }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// 현재 사용자 저장
const saveCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// 현재 사용자 가져오기
const getCurrentUserFromStorage = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export class AuthService {
  static async login(email: string, password: string): Promise<User> {
    // 이메일 또는 아이디로 로그인 가능
    const isEmail = email.includes('@');
    
    if (isEmail && !email.endsWith('@kakaopaysec.com')) {
      throw new Error('카카오페이증권 이메일(@kakaopaysec.com)만 사용 가능합니다.');
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const { password: _, ...userWithoutPassword } = user;
    saveCurrentUser(userWithoutPassword);
    return userWithoutPassword;
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

    const users = getUsers();
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    const [firstName, lastName] = emailPrefix.split('.');
    const newUser: User & { password: string } = {
      email,
      password,
      name: rest.name || `${firstName}.${lastName}`,
      englishName: rest.englishName || `${firstName} ${lastName}`,
      dept: rest.dept || '개발팀',
      building: rest.building || '판교오피스',
      workArea: rest.workArea || '',
      phone: rest.phone || '010-0000-0000',
      car: rest.car || '',
      isAdmin: false,
      adminLevel: null
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    saveCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  }

  static async updateProfile(profileData: Partial<User>): Promise<User> {
    const currentUser = getCurrentUserFromStorage();
    
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex === -1) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const updatedUser = {
      ...users[userIndex],
      ...profileData,
    };

    users[userIndex] = updatedUser;
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = updatedUser;
    saveCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  }

  static async getCurrentUser(): Promise<User | null> {
    return getCurrentUserFromStorage();
  }

  static async logout(): Promise<void> {
    saveCurrentUser(null);
  }

  static async isAuthenticated(): Promise<boolean> {
    return getCurrentUserFromStorage() !== null;
  }
}