import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, Input, Select } from '@/components/ui/FormField';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/store/authStore';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
  Building,
  MapPin,
  Edit
} from 'lucide-react';

export default function Settings() {
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    englishName: user?.englishName || '',
    dept: user?.dept || '',
    building: user?.building || '판교오피스',
    workArea: user?.workArea || '',
    phone: user?.phone || '',
    car: user?.car || ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    bookingReminders: true,
    requestUpdates: true
  });
  
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const getWorkAreaOptions = () => {
    if (profileData.building === '판교오피스') {
      return ['실리콘밸리', '팔로알토', '월스트리트'];
    } else if (profileData.building === '여의도오피스') {
      return ['퀸즈', '브루클린'];
    }
    return [];
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ 
      ...prev, 
      [name]: value,
      // Reset work area when building changes
      ...(name === 'building' ? { workArea: '' } : {})
    }));
  };

  const handleProfileSave = async () => {
    setIsUpdating(true);
    try {
      await updateProfile(profileData);
      setIsProfileModalOpen(false);
      // Success feedback could be added here
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsUpdating(false);
    }
  };

  const openProfileModal = () => {
    // Reset form data to current user data when opening modal
    setProfileData({
      name: user.name || '',
      englishName: user.englishName || '',
      dept: user.dept || '',
      building: user.building || '판교오피스',
      workArea: user.workArea || '',
      phone: user.phone || '',
      car: user.car || ''
    });
    clearError();
    setIsProfileModalOpen(true);
  };

  const handleNotificationSave = () => {
    // Save notification settings
    setIsNotificationModalOpen(false);
  };

  const handleSecuritySave = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    // Save security settings
    setIsSecurityModalOpen(false);
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const settingsGroups = [
    {
      title: '계정 정보',
      items: [
        { 
          icon: User, 
          label: '프로필 관리', 
          description: '개인정보 및 프로필 수정',
          action: () => openProfileModal()
        },
        { 
          icon: Shield, 
          label: '보안 설정', 
          description: '비밀번호 변경 및 보안 관리',
          action: () => setIsSecurityModalOpen(true)
        },
      ]
    },
    {
      title: '앱 설정',
      items: [
        { 
          icon: Bell, 
          label: '알림 설정', 
          description: '푸시 알림 및 이메일 알림 관리',
          action: () => setIsNotificationModalOpen(true)
        },
        { 
          icon: Palette, 
          label: '테마 설정', 
          description: '다크 모드 및 테마 변경',
          action: () => setIsThemeModalOpen(true)
        },
      ]
    },
    {
      title: '지원',
      items: [
        { 
          icon: HelpCircle, 
          label: '도움말', 
          description: '자주 묻는 질문 및 사용법',
          action: () => setIsHelpModalOpen(true)
        },
      ]
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 px-2">
        <Link to="/">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-muted/50">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">설정</h1>
          <p className="text-muted-foreground text-sm mt-1">
            앱 설정을 관리하세요
          </p>
        </div>
      </div>

      {/* 사용자 정보 카드 */}
      <Card className="shadow-md border-0 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">{user.name.charAt(0)}</span>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold text-foreground leading-tight">
                {user.name} ({user.englishName})
              </h3>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{user.dept}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{user.building}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{user.workArea || '근무구역 미설정'}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 설정 그룹들 */}
      <div className="space-y-8">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            <h2 className="text-xl font-bold px-1 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full mr-3"></span>
              {group.title}
            </h2>
            <Card className="shadow-md border-0">
              <CardContent className="p-0">
                {group.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={item.action}
                    className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left space-y-1">
                        <h3 className="font-semibold text-foreground leading-tight">{item.label}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* 로그아웃 버튼 */}
      <Card className="shadow-md border-0">
        <CardContent className="p-8">
          <Button
            onClick={() => useAuthStore.getState().logout()}
            variant="destructive"
            className="w-full h-14 text-lg font-semibold flex items-center justify-center space-x-3"
          >
            <LogOut className="h-5 w-5" />
            <span>로그아웃</span>
          </Button>
        </CardContent>
      </Card>

      {/* 프로필 수정 모달 */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="프로필 수정"
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <FormField label="이름 (한글)" required>
            <Input
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              placeholder="홍길동"
              disabled={isUpdating}
            />
          </FormField>

          <FormField label="영어이름" required>
            <Input
              name="englishName"
              value={profileData.englishName}
              onChange={handleProfileChange}
              placeholder="Hong Gildong"
              disabled={isUpdating}
            />
          </FormField>

          <FormField label="부서" required>
            <Select
              name="dept"
              value={profileData.dept}
              onChange={handleProfileChange}
              disabled={isUpdating}
            >
              <option value="개발팀">개발팀</option>
              <option value="기획팀">기획팀</option>
              <option value="디자인팀">디자인팀</option>
              <option value="마케팅팀">마케팅팀</option>
              <option value="영업팀">영업팀</option>
              <option value="총무팀">총무팀</option>
              <option value="인사팀">인사팀</option>
              <option value="경영팀">경영팀</option>
            </Select>
          </FormField>

          <FormField label="오피스" required>
            <Select
              name="building"
              value={profileData.building}
              onChange={handleProfileChange}
              disabled={isUpdating}
            >
              <option value="판교오피스">판교오피스</option>
              <option value="여의도오피스">여의도오피스</option>
            </Select>
          </FormField>

          <FormField label="근무구역" required>
            <Select
              name="workArea"
              value={profileData.workArea}
              onChange={handleProfileChange}
              disabled={isUpdating || !profileData.building}
            >
              <option value="">근무구역을 선택하세요</option>
              {getWorkAreaOptions().map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="전화번호">
            <Input
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              placeholder="010-1234-5678"
              disabled={isUpdating}
            />
          </FormField>

          <FormField label="차량번호">
            <Input
              name="car"
              value={profileData.car}
              onChange={handleProfileChange}
              placeholder="11가1111"
              disabled={isUpdating}
            />
          </FormField>

          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsProfileModalOpen(false)}
              className="flex-1"
              disabled={isUpdating}
            >
              취소
            </Button>
            <Button 
              onClick={handleProfileSave}
              className="flex-1"
              disabled={isUpdating}
            >
              {isUpdating ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 알림 설정 모달 */}
      <Modal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        title="알림 설정"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <h3 className="font-medium">푸시 알림</h3>
                <p className="text-sm text-muted-foreground">앱 알림 받기</p>
              </div>
              <input 
                type="checkbox" 
                checked={notificationSettings.pushNotifications}
                onChange={(e) => setNotificationSettings(prev => ({...prev, pushNotifications: e.target.checked}))}
                className="w-4 h-4"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <h3 className="font-medium">이메일 알림</h3>
                <p className="text-sm text-muted-foreground">이메일로 알림 받기</p>
              </div>
              <input 
                type="checkbox" 
                checked={notificationSettings.emailNotifications}
                onChange={(e) => setNotificationSettings(prev => ({...prev, emailNotifications: e.target.checked}))}
                className="w-4 h-4"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <h3 className="font-medium">예약 알림</h3>
                <p className="text-sm text-muted-foreground">회의실/오피스 예약 알림</p>
              </div>
              <input 
                type="checkbox" 
                checked={notificationSettings.bookingReminders}
                onChange={(e) => setNotificationSettings(prev => ({...prev, bookingReminders: e.target.checked}))}
                className="w-4 h-4"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsNotificationModalOpen(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button 
              onClick={handleNotificationSave}
              className="flex-1"
            >
              저장
            </Button>
          </div>
        </div>
      </Modal>

      {/* 보안 설정 모달 */}
      <Modal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        title="보안 설정"
      >
        <div className="space-y-4">
          <FormField label="현재 비밀번호" required>
            <Input
              type="password"
              value={securityData.currentPassword}
              onChange={(e) => setSecurityData(prev => ({...prev, currentPassword: e.target.value}))}
              placeholder="현재 비밀번호"
            />
          </FormField>
          
          <FormField label="새 비밀번호" required>
            <Input
              type="password"
              value={securityData.newPassword}
              onChange={(e) => setSecurityData(prev => ({...prev, newPassword: e.target.value}))}
              placeholder="새 비밀번호"
            />
          </FormField>
          
          <FormField label="새 비밀번호 확인" required>
            <Input
              type="password"
              value={securityData.confirmPassword}
              onChange={(e) => setSecurityData(prev => ({...prev, confirmPassword: e.target.value}))}
              placeholder="새 비밀번호 확인"
            />
          </FormField>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsSecurityModalOpen(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button 
              onClick={handleSecuritySave}
              className="flex-1"
            >
              변경
            </Button>
          </div>
        </div>
      </Modal>

      {/* 테마 설정 모달 */}
      <Modal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        title="테마 설정"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <button className="w-full p-4 text-left bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">라이트 모드</h3>
                  <p className="text-sm text-muted-foreground">밝은 테마</p>
                </div>
                <div className="w-4 h-4 rounded-full bg-primary"></div>
              </div>
            </button>
            
            <button className="w-full p-4 text-left bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">다크 모드</h3>
                  <p className="text-sm text-muted-foreground">어두운 테마</p>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-muted"></div>
              </div>
            </button>
            
            <button className="w-full p-4 text-left bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">시스템 설정</h3>
                  <p className="text-sm text-muted-foreground">시스템 설정에 따라</p>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-muted"></div>
              </div>
            </button>
          </div>
          
          <Button 
            onClick={() => setIsThemeModalOpen(false)}
            className="w-full"
          >
            확인
          </Button>
        </div>
      </Modal>

      {/* 도움말 모달 */}
      <Modal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="도움말"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-2">회의실 예약</h3>
              <p className="text-sm text-muted-foreground">
                홈 화면에서 '회의실 예약'을 선택하여 원하는 날짜와 시간을 예약할 수 있습니다.
              </p>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-2">스마트 오피스</h3>
              <p className="text-sm text-muted-foreground">
                개인 업무 공간을 예약하여 집중할 수 있는 환경을 제공합니다.
              </p>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-2">각종 신청</h3>
              <p className="text-sm text-muted-foreground">
                주차권, 명함, 환경개선 등 다양한 신청을 온라인으로 처리할 수 있습니다.
              </p>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-2">문의하기</h3>
              <p className="text-sm text-muted-foreground">
                추가 문의사항은 총무팀(ext.1234)로 연락해 주세요.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => setIsHelpModalOpen(false)}
            className="w-full"
          >
            확인
          </Button>
        </div>
      </Modal>

      {/* 하단 여백 */}
      <div className="h-4" />
    </div>
  );
}