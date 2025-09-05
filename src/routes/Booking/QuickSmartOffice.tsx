import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Clock, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmartOffice {
  id: string;
  seatNumber: number;
  building: '판교오피스' | '여의도오피스';
  status: 'available' | 'occupied' | 'my-booking';
  bookedBy?: string;
  startTime?: string;
  endTime?: string;
}

// 판교오피스 1-10번, 여의도오피스 1-10번 총 20석
const mockOffices: SmartOffice[] = [
  // 판교오피스 (1-10번)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `pangyo-${i + 1}`,
    seatNumber: i + 1,
    building: '판교오피스' as const,
    status: Math.random() > 0.3 ? 'available' as const : 'occupied' as const
  })),
  // 여의도오피스 (1-10번)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `yeouido-${i + 1}`,
    seatNumber: i + 1,
    building: '여의도오피스' as const,
    status: Math.random() > 0.3 ? 'available' as const : 'occupied' as const
  }))
];

export default function QuickSmartOffice() {
  const { toast } = useToast();
  const [offices, setOffices] = useState<SmartOffice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 스마트 오피스 로딩 시뮬레이션
    setTimeout(() => {
      setOffices(mockOffices);
      setIsLoading(false);
    }, 800);
  }, []);

  const useOffice = (office: SmartOffice) => {
    const now = new Date();
    const endTime = new Date();
    endTime.setHours(18, 0, 0, 0); // 퇴근시간 6시로 설정
    
    // 해당 자리를 내 예약으로 변경
    setOffices(prevOffices => 
      prevOffices.map(o => 
        o.id === office.id 
          ? { 
              ...o, 
              status: 'my-booking',
              bookedBy: '나',
              startTime: now.toISOString(),
              endTime: endTime.toISOString()
            }
          : o
      )
    );

    const formatTime = (date: Date) => date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    
    toast({
      title: "이용 시작! ✨",
      description: `${office.building} ${office.seatNumber}번석 이용 시작 (${formatTime(now)} ~ ${formatTime(endTime)})`,
    });
  };

  const cancelBooking = (office: SmartOffice) => {
    // 예약 취소 - 사용 가능 상태로 변경
    setOffices(prevOffices => 
      prevOffices.map(o => 
        o.id === office.id 
          ? { 
              ...o, 
              status: 'available',
              bookedBy: undefined,
              startTime: undefined,
              endTime: undefined
            }
          : o
      )
    );

    toast({
      title: "예약이 취소되었습니다",
      description: `${office.building} ${office.seatNumber}번석 예약이 취소되었습니다.`,
      variant: "destructive"
    });
  };

  const getAvailableCount = (building: string) => {
    return offices.filter(office => office.building === building && office.status === 'available').length;
  };

  const getTotalCount = (building: string) => {
    return offices.filter(office => office.building === building).length;
  };

  const getSeatIcon = (status: SmartOffice['status']) => {
    switch (status) {
      case 'available':
        return '🟢';
      case 'my-booking':
        return '🔵';
      case 'occupied':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            홈으로 돌아가기
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              스마트 오피스 즉시예약
            </h1>
            <p className="text-lg text-muted-foreground">지금 바로 이용 가능한 워크스페이스를 선택하세요</p>
          </div>
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse"></div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-lg font-medium">최적의 워크스페이스를 찾고 있습니다</p>
                <p className="text-sm text-muted-foreground">잠시만 기다려주세요...</p>
              </div>
            </div>
            
            <div className="grid gap-6">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse border-0 shadow-sm">
                  <div className="space-y-4">
                    <div className="h-6 bg-muted rounded-lg w-32"></div>
                    <div className="grid grid-cols-5 gap-3">
                      {[...Array(10)].map((_, j) => (
                        <div key={j} className="h-20 bg-muted rounded-xl"></div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 빌딩별 현황 */}
        {!isLoading && (
          <div className="space-y-10">
            {['판교오피스', '여의도오피스'].map((building, buildingIndex) => (
              <Card key={building} className="overflow-hidden border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <div className="p-6 space-y-6">
                  {/* 빌딩 헤더 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{building}</h3>
                        <p className="text-sm text-muted-foreground">Smart Workspace</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="outline" className="text-sm font-medium px-3 py-1">
                        <Users className="h-3 w-3 mr-1" />
                        {getAvailableCount(building)}/{getTotalCount(building)} 사용가능
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>~ 18:00까지</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 자리 배치 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">🟢</span>
                        <span>사용가능</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">🔵</span>
                        <span>내 예약</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">🔴</span>
                        <span>사용중</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4">
                      {offices
                        .filter(office => office.building === building)
                        .sort((a, b) => a.seatNumber - b.seatNumber)
                        .map((office, index) => (
                          <div
                            key={office.id}
                            className={`group relative aspect-square rounded-2xl transition-all duration-300 cursor-pointer ${
                              office.status === 'available' 
                                ? 'bg-gradient-to-br from-success/5 to-success/10 hover:from-success/10 hover:to-success/20 border-2 border-success/20 hover:border-success/40 hover:scale-105 hover:shadow-lg hover:shadow-success/25' 
                                : office.status === 'my-booking'
                                ? 'bg-gradient-to-br from-primary/10 to-primary/20 border-2 border-primary/40 shadow-lg shadow-primary/25 scale-105'
                                : 'bg-gradient-to-br from-muted/50 to-muted/80 border-2 border-muted opacity-60 cursor-not-allowed'
                            }`}
                            style={{ animationDelay: `${(buildingIndex * 10 + index) * 30}ms` }}
                            onClick={() => {
                              if (office.status === 'available') {
                                useOffice(office);
                              } else if (office.status === 'my-booking') {
                                cancelBooking(office);
                              }
                            }}
                          >
                            <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-3 space-y-2">
                              {/* 상태 아이콘 */}
                              <div className="text-2xl animate-pulse">
                                {getSeatIcon(office.status)}
                              </div>
                              
                              {/* 자리 번호 */}
                              <div className={`text-lg font-bold ${
                                office.status === 'available' 
                                  ? 'text-success' 
                                  : office.status === 'my-booking'
                                  ? 'text-primary'
                                  : 'text-muted-foreground'
                              }`}>
                                {office.seatNumber}
                              </div>
                              
                              {/* 상태 텍스트 */}
                              <div className={`text-xs font-medium text-center leading-tight ${
                                office.status === 'available' 
                                  ? 'text-success' 
                                  : office.status === 'my-booking'
                                  ? 'text-primary'
                                  : 'text-muted-foreground'
                              }`}>
                                {office.status === 'available' 
                                  ? '클릭하여\n예약' 
                                  : office.status === 'my-booking'
                                  ? '클릭하여\n취소'
                                  : '사용중'}
                              </div>
                            </div>
                            
                            {/* 호버 효과 */}
                            {office.status !== 'occupied' && (
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 하단 액션 */}
        <div className="mt-10 space-y-4">
          <Link to="/booking/smart-office">
            <Button variant="outline" size="lg" className="w-full h-14 text-base font-medium rounded-xl border-2 hover:bg-muted/50">
              전체 스마트 오피스 예약하기
            </Button>
          </Link>
          
          <Card className="border-0 bg-gradient-to-r from-primary/5 via-accent/5 to-success/5 backdrop-blur-sm">
            <div className="p-6 text-center space-y-3">
              <div className="text-lg font-semibold text-foreground">⚡ 즉시예약 가이드</div>
              <div className="text-sm text-muted-foreground space-y-1.5 leading-relaxed max-w-md mx-auto">
                <p>• 원하는 자리를 클릭하면 즉시 예약됩니다</p>
                <p>• 예약 시간은 현재 시간부터 18:00까지 자동 설정</p>
                <p>• 내 예약은 언제든 클릭하여 취소할 수 있습니다</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 하단 여백 */}
        <div className="h-10" />
      </div>
    </div>
  );
}