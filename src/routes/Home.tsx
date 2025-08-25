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
    <div className="py-8 space-y-8">
      {/* Welcome Section */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          안녕하세요, {user.name}님
        </h1>
        <p className="text-muted-foreground">
          {user.dept} · {user.building}
        </p>
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-sm font-medium">온라인</span>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">빠른 서비스</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCards.map((service) => (
            <Card key={service.path} variant="elevated" className="hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${service.color} text-white`}>
                    <service.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
                <Button asChild variant="outline" className="w-full">
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
        <h2 className="text-xl font-semibold">실내 온도 조절</h2>
        <Card>
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
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/requests/environment?temp=cold">
                    추워요
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/requests/environment?temp=hot">
                    더워요
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
          <h2 className="text-xl font-semibold">관리자 도구</h2>
          <Card variant="bordered">
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
                <Button variant="destructive" asChild>
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
      <div className="h-4 md:hidden" />
    </div>
  );
}