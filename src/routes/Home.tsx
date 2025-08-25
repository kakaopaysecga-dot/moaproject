import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  Car, 
  Heart, 
  Thermometer, 
  Camera,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const serviceCards = [
  {
    title: '예약 서비스',
    description: '스마트오피스 좌석 및 회의실 예약',
    icon: Calendar,
    path: '/booking',
    color: 'bg-corporate-blue'
  },
  {
    title: '요청 관리',
    description: '각종 업무 요청 및 처리 현황',
    icon: FileText,
    path: '/requests',
    color: 'bg-accent'
  },
  {
    title: '명함 신청',
    description: '개인 명함 제작 신청',
    icon: CreditCard,
    path: '/requests/business-card',
    color: 'bg-success'
  },
  {
    title: '주차 등록',
    description: '회사 주차장 이용 등록',
    icon: Car,
    path: '/requests/parking',
    color: 'bg-warning'
  },
  {
    title: '경조사 지원',
    description: '결혼, 장례 등 경조사 지원 신청',
    icon: Heart,
    path: '/requests/events',
    color: 'bg-destructive'
  },
  {
    title: '사무환경 개선',
    description: '사무실 환경 개선 요청',
    icon: Camera,
    path: '/requests/environment',
    color: 'bg-corporate-blue'
  }
];

export default function Home() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">MOA에 오신 것을 환영합니다</h1>
          <p className="text-muted-foreground">로그인이 필요합니다.</p>
          <Button asChild>
            <Link to="/login">로그인</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Section */}
      <section className="relative text-center space-y-6 p-6 rounded-3xl bg-gradient-to-br from-primary via-accent to-corporate-blue overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-white/10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="relative z-10">
          <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/30">
            <span className="text-white font-bold text-3xl drop-shadow-sm">M</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white drop-shadow-sm">
              안녕하세요, {user.name}님
            </h1>
            <p className="text-white/80 font-medium">
              {user.dept} · {user.building}
            </p>
          </div>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-white">온라인</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold px-1 flex items-center">
          <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full mr-3"></span>
          빠른 서비스
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {serviceCards.map((service) => (
            <Link key={service.path} to={service.path} className="group">
              <Card className="h-full border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.96] group-hover:-translate-y-1 overflow-hidden">
                <CardContent className="p-5 text-center space-y-3">
                  <div className={`mx-auto w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm leading-tight">{service.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Temperature Request Quick Access */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold px-1 flex items-center">
          <span className="w-1 h-6 bg-gradient-to-b from-warning to-destructive rounded-full mr-3"></span>
          실내 온도 조절
        </h2>
        <Card className="border-0 bg-white shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-br from-accent to-corporate-blue rounded-2xl shadow-lg">
                  <Thermometer className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">실내 온도가 불편하신가요?</h3>
                  <p className="text-sm text-muted-foreground">
                    온도 조절을 간편하게 요청하세요
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild className="h-12 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                  <Link to="/requests/environment?temp=cold" className="flex items-center justify-center space-x-2">
                    <span className="text-lg">🥶</span>
                    <span className="font-medium">추워요</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-12 border-2 border-red-200 hover:bg-red-50 hover:border-red-300">
                  <Link to="/requests/environment?temp=hot" className="flex items-center justify-center space-x-2">
                    <span className="text-lg">🔥</span>
                    <span className="font-medium">더워요</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Admin Quick Access */}
      {user.isAdmin && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold px-1 flex items-center">
            <span className="w-1 h-6 bg-gradient-to-b from-destructive to-primary rounded-full mr-3"></span>
            관리자 도구
          </h2>
          <Card className="border-0 bg-gradient-to-br from-destructive/10 to-primary/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-br from-destructive to-primary rounded-2xl shadow-lg">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">관리자 페이지</h3>
                    <p className="text-sm text-muted-foreground">
                      요청 관리 및 시스템 설정
                    </p>
                  </div>
                </div>
                <Button asChild className="h-12 px-6 bg-gradient-to-r from-destructive to-primary hover:from-destructive/90 hover:to-primary/90 text-white font-medium shadow-lg">
                  <Link to="/admin">
                    관리하기
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Footer Space for Mobile Navigation */}
      <div className="h-6" />
    </div>
  );
}