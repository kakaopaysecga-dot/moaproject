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
    <div className="py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">스마트오피스 예약</h1>
        <p className="text-muted-foreground">개인 업무용 좌석을 예약하세요</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 날짜 선택 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              날짜 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getAvailableDates().map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedDate(date)}
                >
                  {new Date(date).toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                  {date === new Date().toISOString().split('T')[0] && (
                    <Badge variant="secondary" className="ml-2">오늘</Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 좌석 선택 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              좌석 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((seatNum) => {
                const isOccupied = occupiedSeats.has(seatNum);
                const isSelected = selectedSeat === seatNum;
                
                return (
                  <Button
                    key={seatNum}
                    variant={isSelected ? "default" : isOccupied ? "secondary" : "outline"}
                    className="aspect-square p-0"
                    disabled={isOccupied}
                    onClick={() => setSelectedSeat(isSelected ? null : seatNum)}
                  >
                    {seatNum}
                  </Button>
                );
              })}
            </div>
            <div className="mt-4 flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-input rounded"></div>
                <span>이용 가능</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-secondary rounded"></div>
                <span>예약됨</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>선택됨</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 시간 선택 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              시간 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-1 max-h-64 overflow-y-auto">
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
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">선택된 예약 정보</h3>
              <div className="text-sm text-muted-foreground">
                {selectedDate && selectedSeat && selectedTime ? (
                  <>
                    {new Date(selectedDate).toLocaleDateString('ko-KR')} {selectedTime} | {selectedSeat}번 좌석
                  </>
                ) : (
                  '날짜, 좌석, 시간을 선택해주세요'
                )}
              </div>
            </div>
            <Button 
              onClick={handleReservation}
              disabled={!selectedDate || !selectedSeat || !selectedTime}
            >
              예약하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}