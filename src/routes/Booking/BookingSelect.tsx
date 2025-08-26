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

        {/* 카드 그리드 - 모바일 친화적 가로 스크롤 */}
        <div className="w-full">
          {/* 데스크톱: 그리드 레이아웃 */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {bookingOptions.map((option, index) => (
              <Link key={option.id} to={option.path} className="group">
                <Card className="h-full bg-gradient-to-br from-background to-muted/10 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardHeader className="text-center pb-4 pt-6 relative z-10">
                    <div className="relative mb-4">
                      <div className={`w-16 h-16 ${option.bgColor} rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <option.icon className={`h-8 w-8 ${option.color} group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
                        {option.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                        {option.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 px-6 pb-6 relative z-10">
                    <div className="space-y-2">
                      {option.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground group-hover:text-foreground/90 transition-all duration-300">
                          <div className={`w-1.5 h-1.5 ${option.color.replace('text-', 'bg-')} rounded-full mr-2 group-hover:scale-125 transition-transform duration-300`}></div>
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full text-sm font-semibold group-hover:scale-105 transition-all duration-300" variant="outline">
                      시작하기
                    </Button>
                  </CardContent>

                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                    {index + 1}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* 모바일: 가로 스크롤 카드 */}
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto pb-6 px-1 snap-x snap-mandatory scrollbar-hide">
              {bookingOptions.map((option, index) => (
                <Link key={option.id} to={option.path} className="group">
                  <Card className="min-w-[280px] w-[280px] bg-gradient-to-br from-background to-muted/10 border border-border/50 shadow-lg cursor-pointer overflow-hidden relative snap-center">
                    <CardHeader className="text-center pb-4 pt-6">
                      <div className="relative mb-4">
                        <div className={`w-14 h-14 ${option.bgColor} rounded-xl flex items-center justify-center mx-auto shadow-sm`}>
                          <option.icon className={`h-7 w-7 ${option.color}`} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <CardTitle className="text-lg font-bold">
                          {option.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                          {option.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 px-6 pb-6">
                      <div className="space-y-2">
                        {option.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                            <div className={`w-1.5 h-1.5 ${option.color.replace('text-', 'bg-')} rounded-full mr-2`}></div>
                            <span className="font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button className="w-full text-sm font-semibold" variant="outline">
                        시작하기
                      </Button>
                    </CardContent>

                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold opacity-75">
                      {index + 1}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            
            {/* 스크롤 인디케이터 */}
            <div className="flex justify-center gap-2 mt-4">
              {bookingOptions.map((_, index) => (
                <div key={index} className="w-2 h-2 bg-muted rounded-full"></div>
              ))}
            </div>
          </div>
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