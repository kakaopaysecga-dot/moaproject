import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Building
} from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const settingsGroups = [
    {
      title: '계정 정보',
      items: [
        { 
          icon: User, 
          label: '프로필 관리', 
          description: '개인정보 및 프로필 수정',
          action: () => console.log('프로필 관리')
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
            onClick={logout}
            variant="destructive"
            className="w-full h-14 text-lg font-semibold flex items-center justify-center space-x-3"
          >
            <LogOut className="h-5 w-5" />
            <span>로그아웃</span>
          </Button>
        </CardContent>
      </Card>

      {/* 하단 여백 */}
      <div className="h-4" />
    </div>
  );
}