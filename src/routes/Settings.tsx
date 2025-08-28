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
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    dept: user?.dept || '',
    building: user?.building || '판교오피스',
    workArea: user?.workArea || '',
    phone: user?.phone || '',
    car: user?.car || ''
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
      dept: user.dept || '',
      building: user.building || '판교오피스',
      workArea: user.workArea || '',
      phone: user.phone || '',
      car: user.car || ''
    });
    clearError();
    setIsProfileModalOpen(true);
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
          action: () => console.log('보안 설정')
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
          action: () => console.log('알림 설정')
        },
        { 
          icon: Palette, 
          label: '테마 설정', 
          description: '다크 모드 및 테마 변경',
          action: () => console.log('테마 설정')
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
          action: () => console.log('도움말')
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
              <h3 className="text-2xl font-bold text-foreground leading-tight">{user.name}</h3>
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

          <FormField label="이름" required>
            <Input
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              placeholder="이름"
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

      {/* 하단 여백 */}
      <div className="h-4" />
    </div>
  );
}