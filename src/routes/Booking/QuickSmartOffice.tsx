import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, MapPin, Zap, CheckCircle, AlertCircle, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function QuickSmartOffice() {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedOffice, setSelectedOffice] = useState<'판교아지트' | '여의도오피스'>('판교아지트');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const officeData = {
    '판교아지트': {
      totalSeats: 10,
      occupiedSeats: new Set([2, 5, 8]),
    },
    '여의도오피스': {
      totalSeats: 10,
      occupiedSeats: new Set([1, 4, 6]),
    }
  };

  const getCurrentTimeSlot = () => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const timeString = `${hour.toString().padStart(2, '0')}:${minute < 30 ? '00' : '30'}`;
    return timeString;
  };

  const getNextAvailableSlot = () => {
    const currentSlot = getCurrentTimeSlot();
    const currentIndex = timeSlots.indexOf(currentSlot);
    if (currentIndex !== -1 && currentIndex < timeSlots.length - 1) {
      return timeSlots[currentIndex + 1];
    }
    return null;
  };

  const getAvailableSeats = () => {
    const currentData = officeData[selectedOffice];
    const availableSeats = [];
    
    for (let i = 1; i <= currentData.totalSeats; i++) {
      if (!currentData.occupiedSeats.has(i)) {
        availableSeats.push(i);
      }
    }
    
    return availableSeats;
  };

  const handleQuickBooking = (seatNumber: number) => {
    const nextSlot = getNextAvailableSlot();
    if (!nextSlot) {
      toast({
        title: "예약할 수 없습니다",
        description: "현재 시간에는 퀸 예약이 불가능합니다.",
        variant: "destructive"
      });
      return;
    }

    const endTime = timeSlots[timeSlots.indexOf(nextSlot) + 2]; // 1시간 예약
    toast({
      title: "퀸 예약 완료! ⚡",
      description: `${selectedOffice} ${seatNumber}번 좌석이 ${nextSlot}-${endTime}에 예약되었습니다.`,
    });
  };

  const getSeatStatus = (seatNumber: number) => {
    const currentData = officeData[selectedOffice];
    return !currentData.occupiedSeats.has(seatNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/booking" className="p-2 -ml-2 hover:bg-muted/50 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">지금 바로 좌석</h1>
            <p className="text-sm text-muted-foreground">1시간 퀸 예약 서비스</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-secondary">
              {currentTime.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentTime.toLocaleDateString('ko-KR', { 
                month: 'short', 
                day: 'numeric',
                weekday: 'short'
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-md mx-auto">
        {/* 예약 시간 안내 */}
        <Card className="border-0 bg-gradient-to-r from-secondary/10 to-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">퀸 예약 시간</h3>
                <p className="text-sm text-muted-foreground">즉시 1시간 사용</p>
              </div>
            </div>
            {getNextAvailableSlot() ? (
              <div className="bg-background/60 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-secondary">
                  {getNextAvailableSlot()} - {timeSlots[timeSlots.indexOf(getNextAvailableSlot() || '') + 2]}
                </div>
                <div className="text-sm text-muted-foreground">예약 가능 시간</div>
              </div>
            ) : (
              <div className="bg-destructive/10 rounded-lg p-3 text-center">
                <AlertCircle className="h-5 w-5 text-destructive mx-auto mb-1" />
                <div className="text-sm text-destructive">현재 퀸 예약 불가</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 오피스 선택 */}
        <Card className="border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-5 w-5 text-accent" />
              오피스 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={selectedOffice === '판교아지트' ? 'default' : 'outline'}
                className="h-12"
                onClick={() => setSelectedOffice('판교아지트')}
              >
                판교아지트
              </Button>
              <Button
                variant={selectedOffice === '여의도오피스' ? 'default' : 'outline'}
                className="h-12"
                onClick={() => setSelectedOffice('여의도오피스')}
              >
                여의도오피스
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 좌석 선택 */}
        <Card className="border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-5 w-5 text-green-600" />
              사용 가능한 좌석
              <Badge variant="secondary" className="ml-auto">
                {getAvailableSeats().length}/{officeData[selectedOffice].totalSeats}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getAvailableSeats().length > 0 ? (
              <div className="space-y-4">
                {/* 좌석 맵 */}
                <div className="bg-muted/20 rounded-lg p-4">
                  <div className="text-center text-sm text-muted-foreground mb-3">좌석 배치도</div>
                  <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                    {Array.from({ length: officeData[selectedOffice].totalSeats }, (_, i) => i + 1).map((seatNum) => {
                      const isAvailable = getSeatStatus(seatNum);
                      return (
                        <div
                          key={seatNum}
                          className={`
                            w-12 h-12 rounded-lg flex items-center justify-center text-sm font-semibold border-2
                            ${isAvailable 
                              ? 'bg-green-100 border-green-300 text-green-700' 
                              : 'bg-red-100 border-red-300 text-red-700'
                            }
                          `}
                        >
                          {seatNum}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                      <span>사용가능</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                      <span>사용중</span>
                    </div>
                  </div>
                </div>

                {/* 퀸 예약 버튼들 */}
                <div className="space-y-3">
                  {getAvailableSeats().slice(0, 3).map((seatNum) => (
                    <Card key={seatNum} className="border border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                              <span className="font-bold text-secondary">{seatNum}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold">{seatNum}번 좌석</h4>
                              <p className="text-sm text-muted-foreground">{selectedOffice}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            사용가능
                          </Badge>
                        </div>

                        <Button 
                          className="w-full"
                          onClick={() => handleQuickBooking(seatNum)}
                          disabled={!getNextAvailableSlot()}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          바로 예약하기
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {getAvailableSeats().length > 3 && (
                    <div className="text-center pt-2">
                      <Link to="/booking/smart-office">
                        <Button variant="outline" size="sm">
                          더 많은 좌석 보기
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">현재 {selectedOffice}에서 사용 가능한 좌석이 없습니다</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 하단 안내 */}
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4 text-center space-y-2">
            <div className="text-sm font-medium">💡 퀸 예약 안내</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• 클릭 한 번으로 1시간 즉시 예약</div>
              <div>• 현재 시간 기준 다음 시간대부터 예약</div>
              <div>• 추가 시간이 필요하면 현장에서 연장 가능</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}