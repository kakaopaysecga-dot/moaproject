import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Monitor, Wifi, Coffee, Zap, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SmartOffice {
  id: string;
  seatNumber: number;
  building: '판교오피스' | '여의도오피스';
  status: 'available' | 'occupied';
  booking?: {
    id: string;
    user_id: string;
    start_time: string;
    end_time: string;
  };
}

export default function QuickSmartOffice() {
  const { toast } = useToast();
  const [offices, setOffices] = useState<SmartOffice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 스마트 오피스 데이터 로드
  const loadOffices = async () => {
    try {
      // 현재 활성 예약 조회
      const { data: bookings, error } = await supabase
        .from('smart_office_bookings')
        .select('*')
        .eq('status', 'active');

      if (error) {
        console.error('Error loading bookings:', error);
        return;
      }

      // 각 빌딩별 1-10번 좌석 생성
      const allOffices: SmartOffice[] = [];
      
      for (const building of ['판교오피스', '여의도오피스'] as const) {
        for (let i = 1; i <= 10; i++) {
          const booking = bookings?.find(b => 
            b.building === building && b.seat_number === i
          );
          
          allOffices.push({
            id: `${building}-${i}`,
            seatNumber: i,
            building,
            status: booking ? 'occupied' : 'available',
            booking: booking || undefined
          });
        }
      }

      setOffices(allOffices);
    } catch (error) {
      console.error('Error in loadOffices:', error);
      toast({
        title: "오류 발생",
        description: "좌석 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOffices();
    
    // 실시간 업데이트 구독
    const channel = supabase
      .channel('smart-office-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'smart_office_bookings'
        },
        () => {
          loadOffices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const useOffice = async (office: SmartOffice) => {
    if (office.status === 'occupied') return;

    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "로그인 필요",
          description: "스마트 오피스를 이용하려면 로그인이 필요합니다.",
          variant: "destructive"
        });
        return;
      }

      const now = new Date();
      const endTime = new Date();
      endTime.setHours(18, 0, 0, 0); // 퇴근시간 6시로 설정
      
      const { data, error } = await supabase
        .from('smart_office_bookings')
        .insert({
          user_id: user.id,
          seat_number: office.seatNumber,
          building: office.building,
          start_time: now.toISOString(),
          end_time: endTime.toISOString(),
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Booking error:', error);
        toast({
          title: "예약 실패",
          description: "스마트 오피스 예약 중 오류가 발생했습니다.",
          variant: "destructive"
        });
        return;
      }

      const formatTime = (date: Date) => date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      
      toast({
        title: "이용 시작! ✨",
        description: `${office.building} ${office.seatNumber}번석 이용 시작 (${formatTime(now)} ~ ${formatTime(endTime)})`,
      });

      // 데이터 즉시 새로고침
      await loadOffices();
      
    } catch (error) {
      console.error('Error in useOffice:', error);
      toast({
        title: "오류 발생",
        description: "예약 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
          <div className="space-y-6">
            {['판교오피스', '여의도오피스'].map(building => (
              <div key={building} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{building}</h3>
                  <Badge variant="outline">
                    {getAvailableCount(building)}/{getTotalCount(building)} 사용 가능
                  </Badge>
                </div>
                
                
                {/* 홀수 자리 (1, 3, 5, 7, 9) */}
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {offices
                    .filter(office => office.building === building && office.seatNumber % 2 === 1)
                    .sort((a, b) => a.seatNumber - b.seatNumber)
                    .map((office, index) => (
                      <Card 
                        key={office.id}
                        className={`relative p-3 text-center hover:shadow-lg transition-all duration-300 animate-scale-in ${
                          office.status === 'available' 
                            ? 'hover:border-primary cursor-pointer' 
                            : 'opacity-60'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => office.status === 'available' && !isLoading && useOffice(office)}
                      >
                        <div className="space-y-2">
                          <div className="text-sm font-medium">
                            {office.seatNumber}번
                          </div>
                          <div className={`w-3 h-3 rounded-full mx-auto ${
                            office.status === 'available' 
                              ? 'bg-success animate-pulse' 
                              : 'bg-destructive'
                          }`} />
                          <div className="text-xs text-muted-foreground">
                            {office.status === 'available' ? '사용가능' : '사용중'}
                          </div>
                        </div>
                        
                        {office.status === 'available' && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </Card>
                    ))
                  }
                </div>
                
                {/* 짝수 자리 (2, 4, 6, 8, 10) */}
                <div className="grid grid-cols-5 gap-2">
                  {offices
                    .filter(office => office.building === building && office.seatNumber % 2 === 0)
                    .sort((a, b) => a.seatNumber - b.seatNumber)
                    .map((office, index) => (
                      <Card 
                        key={office.id}
                        className={`relative p-3 text-center hover:shadow-lg transition-all duration-300 animate-scale-in ${
                          office.status === 'available' 
                            ? 'hover:border-primary cursor-pointer' 
                            : 'opacity-60'
                        }`}
                        style={{ animationDelay: `${(index + 5) * 50}ms` }}
                        onClick={() => office.status === 'available' && !isLoading && useOffice(office)}
                      >
                        <div className="space-y-2">
                          <div className="text-sm font-medium">
                            {office.seatNumber}번
                          </div>
                          <div className={`w-3 h-3 rounded-full mx-auto ${
                            office.status === 'available' 
                              ? 'bg-success animate-pulse' 
                              : 'bg-destructive'
                          }`} />
                          <div className="text-xs text-muted-foreground">
                            {office.status === 'available' ? '사용가능' : '사용중'}
                          </div>
                        </div>
                        
                        {office.status === 'available' && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </Card>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 전체 스마트 오피스 보기 */}
        <div className="mt-6">
          <Link to="/booking/smart-office">
            <Button variant="outline" className="w-full">
              전체 스마트 오피스 보기
            </Button>
          </Link>
        </div>

        {/* 이용 안내 */}
        <Card className="mt-6 bg-muted/30">
          <div className="p-4 text-center space-y-2">
            <div className="text-sm font-medium">💡 즉시예약 안내</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• 클릭 한 번으로 지금부터 퇴근시간(18:00)까지 이용</div>
              <div>• 실시간 이용현황 확인 가능</div>
              <div>• 다양한 편의시설 제공</div>
              <div>• 홀수석(1,3,5,7,9) / 짝수석(2,4,6,8,10) 배치</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}