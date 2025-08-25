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
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="text-center space-y-4 py-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-corporate-blue to-accent rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-2xl">M</span>
        </div>
        <h1 className="text-2xl font-bold">
          안녕하세요, {user.name}님
        </h1>
        <p className="text-muted-foreground">
          {user.dept} · {user.building}
        </p>
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-success/10 rounded-full">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-success">온라인</span>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold px-1">빠른 서비스</h2>
        <div className="grid grid-cols-1 gap-4">
          {serviceCards.map((service) => (
            <Card key={service.path} variant="elevated" className="hover:shadow-lg transition-all duration-200 active:scale-[0.98] border-0 bg-gradient-to-br from-card to-card/80">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${service.color} text-white shadow-md`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="outline" className="w-full h-11 font-medium">
                  <Link to={service.path}>
                    이용하기
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Temperature Request Quick Access */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold px-1">실내 온도 조절</h2>
        <Card className="border-0 bg-gradient-to-br from-card to-card/80">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-accent rounded-lg">
                  <Thermometer className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">실내 온도가 불편하신가요?</h3>
                  <p className="text-sm text-muted-foreground">
                    온도 조절을 요청하실 수 있습니다
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button variant="outline" size="default" asChild className="flex-1 h-11">
                  <Link to="/requests/environment?temp=cold">
                    🥶 추워요
                  </Link>
                </Button>
                <Button variant="outline" size="default" asChild className="flex-1 h-11">
                  <Link to="/requests/environment?temp=hot">
                    🔥 더워요
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
          <h2 className="text-xl font-semibold px-1">관리자 도구</h2>
          <Card variant="bordered" className="border-0 bg-gradient-to-br from-destructive/5 to-destructive/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-destructive rounded-lg">
                    <Settings className="h-6 w-6 text-destructive-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">관리자 페이지</h3>
                    <p className="text-sm text-muted-foreground">
                      요청 관리 및 시스템 설정
                    </p>
                  </div>
                </div>
                <Button variant="destructive" asChild className="h-11 font-medium">
                  <Link to="/admin">
                    관리자 페이지
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