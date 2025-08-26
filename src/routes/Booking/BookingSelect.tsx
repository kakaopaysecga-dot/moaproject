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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            예약 서비스
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            스마트오피스 좌석부터 회의실까지, 필요한 공간을 간편하게 예약하세요
          </p>
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {bookingOptions.map((option, index) => (
            <Link key={option.id} to={option.path} className="group">
              <Card className="h-full bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden">
                <CardHeader className="text-center pb-4 pt-6">
                  {/* 아이콘 */}
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 ${option.bgColor} rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-all duration-300`}>
                      <option.icon className={`h-8 w-8 ${option.color}`} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                      {option.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {option.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="px-6 pb-6">
                  {/* 기능 목록 */}
                  <div className="space-y-2 mb-4">
                    {option.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className={`w-1.5 h-1.5 ${option.color.replace('text-', 'bg-')} rounded-full mr-3`}></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* 액션 버튼 */}
                  <Button className="w-full" variant="outline">
                    시작하기
                  </Button>
                </CardContent>

                {/* 인덱스 번호 */}
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold opacity-70">
                  {index + 1}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="text-center space-y-3">
          <p className="text-muted-foreground text-sm">
            궁금한 점이 있으시면 언제든지 문의해주세요
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-8 text-xs text-muted-foreground">
            <span>📞 고객센터: 02-123-4567</span>
            <span>⏰ 운영시간: 09:00 - 18:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}