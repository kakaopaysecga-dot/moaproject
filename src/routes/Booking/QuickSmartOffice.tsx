import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
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
    }, 500);
  }, []);

  const useOffice = (office: SmartOffice) => {
    const now = new Date();
    const endTime = new Date();
    endTime.setHours(18, 0, 0, 0);
    
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
      title: "예약 완료!",
      description: `${office.building} ${office.seatNumber}번석 (${formatTime(now)} ~ ${formatTime(endTime)})`,
    });
  };

  const cancelBooking = (office: SmartOffice) => {
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
      title: "예약 취소됨",
      description: `${office.building} ${office.seatNumber}번석 예약이 취소되었습니다.`,
    });
  };

  const getAvailableCount = (building: string) => {
    return offices.filter(office => office.building === building && office.status === 'available').length;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">자리 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* 헤더 */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          홈으로
        </Link>
        <h1 className="text-2xl font-bold mb-2">스마트 오피스 즉시예약</h1>
        <p className="text-muted-foreground">자리를 클릭해서 바로 예약하세요</p>
      </div>

      {/* 판교오피스 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">판교오피스</h2>
          <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
            {getAvailableCount('판교오피스')}/10 사용가능
          </Badge>
        </div>
        
        {/* 홀수 자리 (1, 3, 5, 7, 9) */}
        <div className="grid grid-cols-5 gap-3 mb-3">
          {offices
            .filter(office => office.building === '판교오피스' && office.seatNumber % 2 === 1)
            .sort((a, b) => a.seatNumber - b.seatNumber)
            .map((office) => (
              <Button
                key={office.id}
                variant="outline"
                className={`h-16 flex flex-col gap-1 transition-all duration-200 ${
                  office.status === 'available' 
                    ? 'border-success/30 bg-success/10 hover:bg-success/20 hover:border-success/50 text-success-foreground' 
                    : office.status === 'my-booking'
                    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-muted bg-muted text-muted-foreground opacity-60 cursor-not-allowed'
                }`}
                disabled={office.status === 'occupied'}
                onClick={() => {
                  if (office.status === 'available') {
                    useOffice(office);
                  } else if (office.status === 'my-booking') {
                    cancelBooking(office);
                  }
                }}
              >
                <span className="font-medium">{office.seatNumber}번</span>
                <span className="text-xs">
                  {office.status === 'available' 
                    ? '예약하기' 
                    : office.status === 'my-booking'
                    ? '예약중'
                    : '사용중'}
                </span>
              </Button>
            ))
          }
        </div>
        
        {/* 짝수 자리 (2, 4, 6, 8, 10) */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {offices
            .filter(office => office.building === '판교오피스' && office.seatNumber % 2 === 0)
            .sort((a, b) => a.seatNumber - b.seatNumber)
            .map((office) => (
              <Button
                key={office.id}
                variant="outline"
                className={`h-16 flex flex-col gap-1 transition-all duration-200 ${
                  office.status === 'available' 
                    ? 'border-success/30 bg-success/10 hover:bg-success/20 hover:border-success/50 text-success-foreground' 
                    : office.status === 'my-booking'
                    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-muted bg-muted text-muted-foreground opacity-60 cursor-not-allowed'
                }`}
                disabled={office.status === 'occupied'}
                onClick={() => {
                  if (office.status === 'available') {
                    useOffice(office);
                  } else if (office.status === 'my-booking') {
                    cancelBooking(office);
                  }
                }}
              >
                <span className="font-medium">{office.seatNumber}번</span>
                <span className="text-xs">
                  {office.status === 'available' 
                    ? '예약하기' 
                    : office.status === 'my-booking'
                    ? '예약중'
                    : '사용중'}
                </span>
              </Button>
            ))
          }
        </div>
      </div>

      {/* 여의도오피스 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">여의도오피스</h2>
          <Badge variant="outline" className="border-accent/20 text-accent-foreground bg-accent/5">
            {getAvailableCount('여의도오피스')}/10 사용가능
          </Badge>
        </div>
        
        {/* 홀수 자리 (1, 3, 5, 7, 9) */}
        <div className="grid grid-cols-5 gap-3 mb-3">
          {offices
            .filter(office => office.building === '여의도오피스' && office.seatNumber % 2 === 1)
            .sort((a, b) => a.seatNumber - b.seatNumber)
            .map((office) => (
              <Button
                key={office.id}
                variant="outline"
                className={`h-16 flex flex-col gap-1 transition-all duration-200 ${
                  office.status === 'available' 
                    ? 'border-success/30 bg-success/10 hover:bg-success/20 hover:border-success/50 text-success-foreground' 
                    : office.status === 'my-booking'
                    ? 'border-accent bg-accent text-accent-foreground hover:bg-accent/90'
                    : 'border-muted bg-muted text-muted-foreground opacity-60 cursor-not-allowed'
                }`}
                disabled={office.status === 'occupied'}
                onClick={() => {
                  if (office.status === 'available') {
                    useOffice(office);
                  } else if (office.status === 'my-booking') {
                    cancelBooking(office);
                  }
                }}
              >
                <span className="font-medium">{office.seatNumber}번</span>
                <span className="text-xs">
                  {office.status === 'available' 
                    ? '예약하기' 
                    : office.status === 'my-booking'
                    ? '예약중'
                    : '사용중'}
                </span>
              </Button>
            ))
          }
        </div>
        
        {/* 짝수 자리 (2, 4, 6, 8, 10) */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {offices
            .filter(office => office.building === '여의도오피스' && office.seatNumber % 2 === 0)
            .sort((a, b) => a.seatNumber - b.seatNumber)
            .map((office) => (
              <Button
                key={office.id}
                variant="outline"
                className={`h-16 flex flex-col gap-1 transition-all duration-200 ${
                  office.status === 'available' 
                    ? 'border-success/30 bg-success/10 hover:bg-success/20 hover:border-success/50 text-success-foreground' 
                    : office.status === 'my-booking'
                    ? 'border-accent bg-accent text-accent-foreground hover:bg-accent/90'
                    : 'border-muted bg-muted text-muted-foreground opacity-60 cursor-not-allowed'
                }`}
                disabled={office.status === 'occupied'}
                onClick={() => {
                  if (office.status === 'available') {
                    useOffice(office);
                  } else if (office.status === 'my-booking') {
                    cancelBooking(office);
                  }
                }}
              >
                <span className="font-medium">{office.seatNumber}번</span>
                <span className="text-xs">
                  {office.status === 'available' 
                    ? '예약하기' 
                    : office.status === 'my-booking'
                    ? '예약중'
                    : '사용중'}
                </span>
              </Button>
            ))
          }
        </div>
      </div>

      {/* 안내 */}
      <Card className="p-4 mb-6 bg-muted/50">
        <div className="text-sm space-y-2">
          <p className="font-medium text-foreground">💡 사용 방법</p>
          <ul className="text-muted-foreground space-y-1">
            <li>• <span className="text-success font-medium">초록색 버튼</span>을 클릭하면 즉시 예약됩니다</li>
            <li>• <span className="text-primary font-medium">파란색</span>/<span className="text-accent font-medium">보라색 버튼</span>을 다시 클릭하면 취소됩니다</li>
            <li>• 예약 시간: 지금 ~ 오후 6시까지</li>
          </ul>
        </div>
      </Card>

      {/* 전체 예약 버튼 */}
      <Link to="/booking/smart-office">
        <Button variant="outline" className="w-full">
          전체 스마트 오피스 예약
        </Button>
      </Link>
    </div>
  );
}