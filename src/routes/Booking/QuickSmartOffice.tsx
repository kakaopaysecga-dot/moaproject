import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Monitor, Wifi, Coffee, Zap, CheckCircle, ArrowLeft } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* 헤더 */}
        <div className="mb-6">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
            <ArrowLeft className="h-4 w-4" />
            홈으로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold">스마트 오피스 즉시예약</h1>
          <p className="text-muted-foreground">지금 바로 이용 가능한 스마트 워크스페이스</p>
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">최적의 스마트 오피스를 찾고 있습니다...</span>
            </div>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-2 w-3/4"></div>
                <div className="h-8 bg-muted rounded w-24"></div>
              </Card>
            ))}
          </div>
        )}

        {/* 빌딩별 현황 */}
        {!isLoading && (
          <div className="space-y-8">
            {['판교오피스', '여의도오피스'].map(building => (
              <div key={building} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-semibold text-foreground">{building}</h3>
                  <Badge variant="outline" className="text-sm">
                    {getAvailableCount(building)}/{getTotalCount(building)} 사용 가능
                  </Badge>
                </div>
                
                {/* 모든 자리를 한 번에 표시 (1-10번) */}
                <div className="grid grid-cols-5 gap-3">
                  {offices
                    .filter(office => office.building === building)
                    .sort((a, b) => a.seatNumber - b.seatNumber)
                    .map((office, index) => (
                      <Card 
                        key={office.id}
                        className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg animate-scale-in ${
                          office.status === 'available' 
                            ? 'hover:border-primary cursor-pointer border-border' 
                            : office.status === 'my-booking'
                            ? 'border-2 border-primary bg-primary/5 cursor-pointer shadow-md'
                            : 'opacity-60 border-destructive/20'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => {
                          if (office.status === 'available') {
                            useOffice(office);
                          } else if (office.status === 'my-booking') {
                            cancelBooking(office);
                          }
                        }}
                      >
                        <div className="p-4 text-center space-y-3">
                          {/* 자리 번호 */}
                          <div className="text-base font-semibold text-foreground">
                            {office.seatNumber}번
                          </div>
                          
                          {/* 상태 표시 원 */}
                          <div className="flex justify-center">
                            <div className={`w-4 h-4 rounded-full ${
                              office.status === 'available' 
                                ? 'bg-success animate-pulse' 
                                : office.status === 'my-booking'
                                ? 'bg-primary animate-pulse'
                                : 'bg-destructive'
                            }`} />
                          </div>
                          
                          {/* 상태 텍스트 */}
                          <div className="space-y-1">
                            <div className={`text-sm font-medium ${
                              office.status === 'available' 
                                ? 'text-success' 
                                : office.status === 'my-booking'
                                ? 'text-primary'
                                : 'text-destructive'
                            }`}>
                              {office.status === 'available' 
                                ? '사용가능' 
                                : office.status === 'my-booking'
                                ? '내 예약'
                                : '사용중'}
                            </div>
                            
                            {/* 내 예약일 때 취소 안내 */}
                            {office.status === 'my-booking' && (
                              <div className="text-xs text-muted-foreground">
                                클릭하여 취소
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* 호버 효과 */}
                        {office.status === 'available' && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        )}
                        
                        {/* 내 예약 표시 */}
                        {office.status === 'my-booking' && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-50" />
                        )}
                      </Card>
                    ))
                  }
                </div>
                
                {/* 범례 */}
                <div className="flex justify-center gap-6 mt-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
                    <span className="text-muted-foreground">사용가능</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-muted-foreground">내 예약</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <span className="text-muted-foreground">사용중</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 전체 스마트 오피스 보기 */}
        <div className="mt-8 px-2">
          <Link to="/booking/smart-office">
            <Button variant="outline" className="w-full h-12 text-base font-medium">
              전체 스마트 오피스 보기
            </Button>
          </Link>
        </div>

        {/* 이용 안내 */}
        <Card className="mt-6 bg-muted/30 border-0">
          <div className="p-6 text-center space-y-3">
            <div className="text-base font-semibold text-foreground">💡 즉시예약 안내</div>
            <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
              <div>• 클릭 한 번으로 지금부터 퇴근시간(18:00)까지 이용</div>
              <div>• 내 예약한 자리는 파란색으로 표시되며 클릭하면 취소</div>
              <div>• 실시간 이용현황 확인 가능</div>
              <div>• 다양한 편의시설 제공 (모니터, WiFi, 커피 등)</div>
            </div>
          </div>
        </Card>

        {/* 하단 여백 */}
        <div className="h-8" />
      </div>
    </div>
  );
}