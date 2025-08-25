import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SmartOfficeBooking() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('');

  // Mock data for demonstration
  const occupiedSeats = new Set([2, 5, 8]);
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];
  const blockedSlots = new Set(['12:00', '12:30', '15:00']);

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleReservation = () => {
    if (!selectedDate || !selectedSeat || !selectedTime) {
      toast({
        title: "예약 정보가 부족합니다",
        description: "날짜, 좌석, 시간을 모두 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "예약이 완료되었습니다",
      description: `${selectedDate} ${selectedTime} ${selectedSeat}번 좌석 예약이 완료되었습니다.`
    });

    // Reset form
    setSelectedDate('');
    setSelectedSeat(null);
    setSelectedTime('');
  };

  return (
    <div className="py-6 space-y-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 px-2">
        <Link to="/booking">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-muted/50">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">스마트오피스 예약</h1>
          <p className="text-muted-foreground text-sm mt-1">
            개인 업무용 좌석을 예약하세요
          </p>
        </div>
      </div>

      {/* 예약 단계 */}
      <div className="space-y-8">
        {/* 1단계: 날짜 선택 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">1단계: 날짜 선택</div>
                <div className="text-sm text-muted-foreground font-normal">예약할 날짜를 선택해주세요</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getAvailableDates().map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? "default" : "outline"}
                  className="w-full h-14 justify-between text-left"
                  onClick={() => setSelectedDate(date)}
                >
                  <div>
                    <div className="font-semibold text-base">
                      {new Date(date).toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm opacity-70">
                      {new Date(date).toLocaleDateString('ko-KR', {
                        weekday: 'long'
                      })}
                    </div>
                  </div>
                  {date === new Date().toISOString().split('T')[0] && (
                    <Badge variant="secondary" className="text-xs">오늘</Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 2단계: 좌석 선택 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-lg font-semibold">2단계: 좌석 선택</div>
                <div className="text-sm text-muted-foreground font-normal">원하는 좌석을 선택해주세요</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-5 gap-3 max-w-xs mx-auto">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((seatNum) => {
                const isOccupied = occupiedSeats.has(seatNum);
                const isSelected = selectedSeat === seatNum;
                
                return (
                  <Button
                    key={seatNum}
                    variant={isSelected ? "default" : isOccupied ? "secondary" : "outline"}
                    className="aspect-square text-lg font-bold h-12 w-12"
                    disabled={isOccupied}
                    onClick={() => setSelectedSeat(isSelected ? null : seatNum)}
                  >
                    {seatNum}
                  </Button>
                );
              })}
            </div>
            
            <div className="bg-muted/30 p-6 rounded-xl">
              <h4 className="font-semibold mb-4">좌석 상태 안내</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-input rounded"></div>
                  <span>이용 가능</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-secondary rounded"></div>
                  <span>예약됨</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span>선택됨</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3단계: 시간 선택 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-corporate-blue/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-corporate-blue" />
              </div>
              <div>
                <div className="text-lg font-semibold">3단계: 시간 선택</div>
                <div className="text-sm text-muted-foreground font-normal">이용할 시간을 선택해주세요</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {timeSlots.map((time) => {
                const isBlocked = blockedSlots.has(time);
                const isSelected = selectedTime === time;
                
                return (
                  <Button
                    key={time}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    disabled={isBlocked}
                    onClick={() => setSelectedTime(isSelected ? '' : time)}
                    className="h-12 text-sm font-medium"
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
            
            {blockedSlots.size > 0 && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">알림:</span> 점심시간(12:00-13:00)과 일부 시간대는 예약이 제한됩니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 예약 확인 및 완료 */}
        <Card className="shadow-md border-0">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">예약 정보 확인</h3>
                <p className="text-muted-foreground">선택하신 정보를 확인하고 예약을 완료해주세요</p>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-xl space-y-3">
                {selectedDate && selectedSeat && selectedTime ? (
                  <div className="space-y-3 text-center">
                    <div className="text-lg">
                      <span className="font-medium text-muted-foreground">예약 날짜:</span>
                      <span className="ml-2 font-semibold">
                        {new Date(selectedDate).toLocaleDateString('ko-KR', { 
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric', 
                          weekday: 'long' 
                        })}
                      </span>
                    </div>
                    <div className="text-lg">
                      <span className="font-medium text-muted-foreground">예약 시간:</span>
                      <span className="ml-2 font-semibold">{selectedTime}</span>
                    </div>
                    <div className="text-lg">
                      <span className="font-medium text-muted-foreground">선택 좌석:</span>
                      <span className="ml-2 font-semibold">{selectedSeat}번 좌석</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    위의 단계를 모두 완료해주세요
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleReservation}
                disabled={!selectedDate || !selectedSeat || !selectedTime}
                className="w-full h-14 text-lg font-semibold"
                size="lg"
              >
                좌석 예약 완료하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 하단 여백 */}
      <div className="h-6" />
    </div>
  );
}