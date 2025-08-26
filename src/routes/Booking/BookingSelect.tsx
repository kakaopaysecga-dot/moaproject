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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="text-center space-y-6 mb-16">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              예약 서비스
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              스마트오피스 좌석부터 회의실까지, 필요한 공간을 간편하게 예약하세요
            </p>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"></div>
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {bookingOptions.map((option, index) => (
            <Link key={option.id} to={option.path} className="group">
              <Card className="h-full bg-gradient-to-br from-background to-muted/20 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden relative">
                {/* 백그라운드 그라데이션 */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardHeader className="text-center pb-6 pt-8 relative z-10">
                  {/* 아이콘 컨테이너 */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 ${option.bgColor} rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <option.icon className={`h-10 w-10 ${option.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    {/* 백그라운드 엘레먼트 */}
                    <div className={`absolute -inset-4 ${option.bgColor} rounded-full opacity-20 scale-0 group-hover:scale-100 transition-all duration-500 -z-10`}></div>
                  </div>
                  
                  <div className="space-y-3">
                    <CardTitle className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
                      {option.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                      {option.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 px-6 pb-8 relative z-10">
                  {/* 기능 목록 */}
                  <div className="space-y-3">
                    {option.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex} 
                        className="flex items-center text-sm text-muted-foreground group-hover:text-foreground/90 transition-all duration-300"
                        style={{ 
                          animationDelay: `${featureIndex * 100}ms`,
                          animation: 'fade-in 0.5s ease-out forwards'
                        }}
                      >
                        <div className={`w-2 h-2 ${option.color.replace('text-', 'bg-')} rounded-full mr-3 group-hover:scale-125 transition-transform duration-300`}></div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* 액션 버튼 */}
                  <div className="pt-2">
                    <Button 
                      className="w-full h-12 text-base font-semibold group-hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                      variant="outline"
                    >
                      <span className="group-hover:mr-2 transition-all duration-300">시작하기</span>
                      <div className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                        <span className="text-sm">→</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>

                {/* 카드 인덱스 표시 */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                  {index + 1}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-muted-foreground text-sm">
            궁금한 점이 있으시면 언제든지 문의해주세요
          </p>
          <div className="flex justify-center space-x-8 text-xs text-muted-foreground">
            <span>📞 고객센터: 02-123-4567</span>
            <span>⏰ 운영시간: 09:00 - 18:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}