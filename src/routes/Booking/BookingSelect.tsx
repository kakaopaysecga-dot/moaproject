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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 헤더 섹션 */}
        <div className="text-center space-y-4 mb-12">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              예약 서비스
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              스마트오피스 좌석부터 회의실까지, 필요한 공간을 간편하게 예약하세요
            </p>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"></div>
        </div>

        {/* 서비스 카드 섹션 */}
        <div className="w-full">
          {/* 데스크톱: 3열 그리드 */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
            {bookingOptions.map((option, index) => (
              <Link key={option.id} to={option.path} className="group">
                <Card className="h-full bg-card/50 backdrop-blur-sm border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden relative">
                  {/* 호버 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardHeader className="text-center pb-3 pt-6 relative z-10">
                    {/* 아이콘 */}
                    <div className="relative mb-4">
                      <div className={`w-14 h-14 ${option.bgColor} rounded-xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-all duration-300`}>
                        <option.icon className={`h-7 w-7 ${option.color} group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                        {option.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                        {option.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-6 pb-6 relative z-10">
                    {/* 기능 목록 */}
                    <div className="space-y-2 mb-4">
                      {option.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                          <div className={`w-1.5 h-1.5 ${option.color.replace('text-', 'bg-')} rounded-full mr-3 group-hover:scale-125 transition-transform duration-300`}></div>
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* 액션 버튼 */}
                    <Button className="w-full text-sm font-medium group-hover:scale-105 transition-all duration-300" variant="outline">
                      <span className="group-hover:mr-2 transition-all duration-300">시작하기</span>
                      <div className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                        <span className="text-sm">→</span>
                      </div>
                    </Button>
                  </CardContent>

                  {/* 인덱스 번호 */}
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    {index + 1}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* 모바일: 세로 스택 레이아웃 */}
          <div className="md:hidden space-y-4">
            {bookingOptions.map((option, index) => (
              <Link key={option.id} to={option.path} className="block">
                <Card className="bg-card/50 backdrop-blur-sm border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-md cursor-pointer overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* 아이콘 */}
                      <div className={`w-12 h-12 ${option.bgColor} rounded-lg flex items-center justify-center shadow-sm flex-shrink-0`}>
                        <option.icon className={`h-6 w-6 ${option.color}`} />
                      </div>
                      
                      {/* 내용 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-base truncate">{option.title}</h3>
                          <div className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ml-2">
                            {index + 1}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                        
                        {/* 기능 태그 */}
                        <div className="flex flex-wrap gap-1">
                          {option.features.map((feature, featureIndex) => (
                            <span key={featureIndex} className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-medium">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* 화살표 */}
                      <div className="flex-shrink-0 ml-2">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">→</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="text-center mt-12 space-y-3">
          <p className="text-muted-foreground text-sm">
            궁금한 점이 있으시면 언제든지 문의해주세요
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <span>📞</span>
              <span>고객센터: 02-123-4567</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>⏰</span>
              <span>운영시간: 09:00 - 18:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}