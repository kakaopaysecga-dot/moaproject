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
      id: 'meeting-room',
      title: '회의실 예약',
      description: '팀 회의용 회의실을 예약하세요',
      icon: Users,
      path: '/booking/meeting-room',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      features: ['다양한 크기', '장비 구비', '화상회의 지원']
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
    }
  ];

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-md mx-auto">
        {/* 헤더 섹션 */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            예약 서비스
          </h1>
          <p className="text-muted-foreground text-sm">
            스마트오피스 좌석부터 회의실까지, 필요한 공간을 간편하게 예약하세요
          </p>
        </div>

        {/* 카드 리스트 - 세로 배치 */}
        <div className="space-y-4 mb-8">
          {bookingOptions.map((option, index) => (
            <Link key={option.id} to={option.path} className="block">
              <Card className="bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md cursor-pointer overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* 아이콘 */}
                    <div className={`w-12 h-12 ${option.bgColor} rounded-xl flex items-center justify-center shadow-sm flex-shrink-0`}>
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
                      <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                      
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

        {/* 하단 안내 */}
        <div className="text-center space-y-3">
          <p className="text-muted-foreground text-sm">
            궁금한 점이 있으시면 언제든지 문의해주세요
          </p>
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
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