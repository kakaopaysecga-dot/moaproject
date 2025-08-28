import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Monitor, Wifi, Coffee, Zap, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmartOffice {
  id: string;
  name: string;
  building: string;
  floor: string;
  features: string[];
  status: 'available' | 'occupied';
  occupancy: number;
  maxCapacity: number;
}

const mockOffices: SmartOffice[] = [
  {
    id: '1',
    name: '집중 워크스페이스',
    building: 'A동',
    floor: '4층',
    features: ['고속 WiFi', '무선충전', '개인사물함', '조용한 환경'],
    status: 'available',
    occupancy: 3,
    maxCapacity: 20
  },
  {
    id: '2',
    name: '협업 라운지',
    building: 'B동',
    floor: '3층',
    features: ['대형 모니터', '화이트보드', '커피머신', '편안한 소파'],
    status: 'available',
    occupancy: 8,
    maxCapacity: 15
  },
  {
    id: '3',
    name: '크리에이티브 스튜디오',
    building: 'C동',
    floor: '2층',
    features: ['창의적 공간', 'VR 장비', '디자인 툴', '브레인스토밍 보드'],
    status: 'available',
    occupancy: 2,
    maxCapacity: 12
  },
  {
    id: '4',
    name: '힐링 스페이스',
    building: 'D동',
    floor: '1층',
    features: ['자연광', '식물', '안마의자', '명상 공간'],
    status: 'occupied',
    occupancy: 10,
    maxCapacity: 10
  }
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
    toast({
      title: "이용 시작! ✨",
      description: `${office.name} 이용이 시작되었습니다. 즐거운 시간 보내세요!`,
    });
  };

  const getOccupancyColor = (occupancy: number, maxCapacity: number) => {
    const ratio = occupancy / maxCapacity;
    if (ratio < 0.5) return 'text-success';
    if (ratio < 0.8) return 'text-warning';
    return 'text-destructive';
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('WiFi')) return <Wifi className="h-3 w-3" />;
    if (feature.includes('모니터')) return <Monitor className="h-3 w-3" />;
    if (feature.includes('커피')) return <Coffee className="h-3 w-3" />;
    return <Zap className="h-3 w-3" />;
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

        {/* 스마트 오피스 목록 */}
        {!isLoading && (
          <div className="space-y-4">
            {offices.map((office, index) => (
              <Card 
                key={office.id} 
                className="p-4 hover:shadow-lg transition-all duration-300 animate-fade-in border-l-4 border-l-primary"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-3">
                  {/* 기본 정보 */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{office.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {office.building} {office.floor}
                      </div>
                    </div>
                    <Badge className={office.status === 'available' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                      {office.status === 'available' ? '이용 가능' : '만석'}
                    </Badge>
                  </div>

                  {/* 현재 이용률 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">현재 이용률</span>
                      <span className={getOccupancyColor(office.occupancy, office.maxCapacity)}>
                        {office.occupancy}/{office.maxCapacity}명
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${(office.occupancy / office.maxCapacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* 특징 */}
                  <div className="grid grid-cols-2 gap-2">
                    {office.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getFeatureIcon(feature)}
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* 이용 버튼 */}
                  {office.status === 'available' ? (
                    <Button 
                      onClick={() => useOffice(office)} 
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      즉시 이용하기
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full">
                      현재 만석입니다
                    </Button>
                  )}
                </div>
              </Card>
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
              <div>• 클릭 한 번으로 바로 이용 시작</div>
              <div>• 실시간 이용률 확인 가능</div>
              <div>• 다양한 편의시설 제공</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}