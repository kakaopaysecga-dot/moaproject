import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Users, BarChart3 } from 'lucide-react';

export default function BookingSelect() {
  const bookingOptions = [
    {
      id: 'dashboard',
      title: '회의실 대시보드',
      description: '실시간 회의실 현황 및 퀵 미팅 예약',
      icon: BarChart3,
      path: '/booking/dashboard',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      features: ['실시간 타임테이블', '퀵 미팅 예약', '필터 및 검색']
    },
    {
      id: 'smart-office',
      title: '스마트오피스 예약',
      description: '개인 업무용 좌석을 예약하세요',
      icon: Monitor,
      path: '/booking/smart-office',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      features: ['좌석 선택', '시간 예약', '즉시 확인']
    },
    {
      id: 'meeting-room',
      title: '회의실 예약',
      description: '팀 회의용 회의실을 예약하세요',
      icon: Users,
      path: '/booking/meeting-room',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      features: ['다양한 크기', '장비 구비', '화상회의 지원']
    }
  ];

  return (
    <div className="py-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">예약 서비스</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          스마트오피스 좌석부터 회의실까지, 필요한 공간을 간편하게 예약하세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {bookingOptions.map((option) => (
          <Link key={option.id} to={option.path}>
            <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${option.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <option.icon className={`h-8 w-8 ${option.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold">{option.title}</CardTitle>
                <CardDescription className="text-base">{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline">
                  시작하기
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}