import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
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
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
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
        title: "예약 정보 부족",
        description: "날짜, 좌석, 시간을 모두 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "예약 완료",
      description: `${selectedDate} ${selectedTime} ${selectedSeat}번 좌석이 예약되었습니다.`
    });

    // Reset form
    setSelectedDate('');
    setSelectedSeat(null);
    setSelectedTime('');
  };

  return (
    <div className="py-8 space-y-10">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-3xl font-bold tracking-tight">스마트오피스 예약</h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
          개인 업무용 좌석을 예약하세요
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
        {/* 날짜 선택 */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              날짜 선택
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getAvailableDates().map((date) => (
              <Button
                key={date}
                variant={selectedDate === date ? "default" : "outline"}
                className="w-full justify-start h-12 text-base"
                onClick={() => setSelectedDate(date)}
              >
                <div className="flex items-center justify-between w-full">
                  <span>
                    {new Date(date).toLocaleDateString('ko-KR', {
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </span>
                  {date === new Date().toISOString().split('T')[0] && (
                    <Badge variant="secondary" className="ml-2">오늘</Badge>
                  )}
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* 좌석 선택 */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-accent/10 rounded-lg">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              좌석 선택
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((seatNum) => {
                const isOccupied = occupiedSeats.has(seatNum);
                const isSelected = selectedSeat === seatNum;
                
                return (
                  <Button
                    key={seatNum}
                    variant={isSelected ? "default" : isOccupied ? "secondary" : "outline"}
                    className="aspect-square p-0 text-lg font-semibold"
                    disabled={isOccupied}
                    onClick={() => setSelectedSeat(isSelected ? null : seatNum)}
                  >
                    {seatNum}
                  </Button>
                );
              })}
            </div>
            <div className="bg-muted/30 p-4 rounded-xl space-y-3">
              <h4 className="font-semibold text-sm">좌석 상태</h4>
              <div className="grid grid-cols-1 gap-3 text-xs">
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

        {/* 시간 선택 */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-corporate-blue/10 rounded-lg">
                <Clock className="h-5 w-5 text-corporate-blue" />
              </div>
              시간 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
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
                    className="h-10 text-sm"
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 예약 정보 및 버튼 */}
      <Card className="shadow-lg border-0 max-w-6xl mx-auto">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-xl">선택된 예약 정보</h3>
              <div className="text-base text-muted-foreground">
                {selectedDate && selectedSeat && selectedTime ? (
                  <div className="space-y-1">
                    <div><strong>날짜:</strong> {new Date(selectedDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</div>
                    <div><strong>시간:</strong> {selectedTime}</div>
                    <div><strong>좌석:</strong> {selectedSeat}번 좌석</div>
                  </div>
                ) : (
                  '날짜, 좌석, 시간을 모두 선택해주세요'
                )}
              </div>
            </div>
            <Button 
              onClick={handleReservation}
              disabled={!selectedDate || !selectedSeat || !selectedTime}
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg lg:min-w-[200px]"
            >
              좌석 예약하기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 하단 여백 */}
      <div className="h-6" />
    </div>
  );
}