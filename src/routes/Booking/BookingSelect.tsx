import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Users, BarChart3 } from 'lucide-react';

export default function BookingSelect() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/30 px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              예약 서비스
            </h1>
            <div className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString('ko-KR', { 
                month: 'short', 
                day: 'numeric',
                weekday: 'short'
              })} • {currentTime.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* 회의실 서비스 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">회의실 서비스</h2>
          </div>
          
          {/* 퀵 회의실 예약 */}
          <Link to="/booking/quick-meeting">
            <Card className="border-0 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/15 hover:to-primary/10 transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">지금 바로 회의</h3>
                    <p className="text-sm text-muted-foreground mb-2">즉시 사용 가능한 회의실 30분 예약</p>
                    <div className="flex gap-1">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">원클릭</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">즉시확인</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary">⚡</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* 회의실 대시보드 */}
          <Link to="/booking/dashboard">
            <Card className="border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">회의실 현황</h3>
                    <p className="text-sm text-muted-foreground mb-2">실시간 회의실 현황 및 예약</p>
                    <div className="flex gap-1">
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">실시간현황</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">타임테이블</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-muted-foreground">→</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* 회의실 예약 */}
          <Link to="/booking/meeting-room">
            <Card className="border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">시간 예약하기</h3>
                    <p className="text-sm text-muted-foreground mb-2">원하는 시간에 회의실 예약</p>
                    <div className="flex gap-1">
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">시간선택</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">화상회의</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-muted-foreground">→</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 스마트오피스 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-semibold">스마트오피스</h2>
          </div>

          {/* 스마트오피스 예약 */}
          <Link to="/booking/smart-office">
            <Card className="border border-border/50 hover:border-secondary/30 transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Monitor className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">좌석 예약하기</h3>
                    <p className="text-sm text-muted-foreground mb-2">원하는 시간에 좌석 예약</p>
                    <div className="flex gap-1">
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">좌석맵</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">시간선택</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-muted-foreground">→</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 하단 도움말 */}
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4 text-center space-y-3">
            <div className="text-sm font-medium">💡 이용 안내</div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div>⚡ 퀵 예약: 30분 즉시 예약</div>
              <div>🕒 시간 예약: 원하는 시간대 선택</div>
              <div>📞 문의: 02-123-4567 (09:00-18:00)</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}