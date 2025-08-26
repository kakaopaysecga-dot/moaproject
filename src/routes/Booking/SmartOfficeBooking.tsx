import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, User, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SmartOfficeBooking() {
  const { toast } = useToast();
  const [selectedOffice, setSelectedOffice] = useState<'판교아지트' | '여의도오피스' | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  // Mock data for demonstration - separate for each office
  const officeData = {
    '판교아지트': {
      occupiedSeats: new Set([2, 5, 8, 12, 15]),
      bookedTimeSlots: {
        '09:00': [1, 3, 7],
        '09:30': [1, 3, 7, 9],
        '12:00': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // Lunch time
        '12:30': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // Lunch time
        '15:00': [4, 6, 11, 14]
      }
    },
    '여의도오피스': {
      occupiedSeats: new Set([1, 4, 6, 9, 13]),
      bookedTimeSlots: {
        '10:00': [2, 5, 8],
        '10:30': [2, 5, 8, 10],
        '12:00': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // Lunch time
        '12:30': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // Lunch time
        '14:00': [3, 7, 12, 16]
      }
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

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

  const getCurrentOfficeData = () => {
    return selectedOffice ? officeData[selectedOffice] : null;
  };

  const isTimeSlotAvailable = (time: string, seatNum: number) => {
    const currentData = getCurrentOfficeData();
    if (!currentData) return true;
    
    const bookedSeats = currentData.bookedTimeSlots[time] || [];
    return !bookedSeats.includes(seatNum);
  };

  const toggleTimeSlot = (time: string) => {
    if (!selectedSeat) {
      toast({
        title: "좌석을 먼저 선택해주세요",
        description: "시간 선택 전에 좌석을 선택해야 합니다.",
        variant: "destructive"
      });
      return;
    }

    if (!isTimeSlotAvailable(time, selectedSeat)) {
      toast({
        title: "예약할 수 없는 시간입니다",
        description: "해당 시간에는 이미 다른 예약이 있습니다.",
        variant: "destructive"
      });
      return;
    }

    setSelectedTimeSlots(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time].sort()
    );
  };

  const handleReservation = () => {
    if (!selectedOffice || !selectedDate || !selectedSeat || selectedTimeSlots.length === 0) {
      toast({
        title: "예약 정보가 부족합니다",
        description: "오피스, 날짜, 좌석, 시간을 모두 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "예약이 완료되었습니다",
      description: `${selectedOffice} ${selectedDate} ${selectedSeat}번 좌석 (${selectedTimeSlots.join(', ')}) 예약이 완료되었습니다.`
    });

    // Reset form
    setSelectedOffice(null);
    setSelectedDate('');
    setSelectedSeat(null);
    setSelectedTimeSlots([]);
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
        {/* 1단계: 오피스 선택 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">1단계: 오피스 선택</div>
                <div className="text-sm text-muted-foreground font-normal">스마트오피스가 위치한 곳을 선택해주세요</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">오피스 위치</Label>
              <RadioGroup value={selectedOffice || ''} onValueChange={(value) => {
                setSelectedOffice(value as '판교아지트' | '여의도오피스');
                setSelectedSeat(null);
                setSelectedTimeSlots([]);
              }}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="판교아지트" id="pangyo" />
                    <Label htmlFor="pangyo" className="text-base font-medium cursor-pointer">판교아지트</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="여의도오피스" id="yeouido" />
                    <Label htmlFor="yeouido" className="text-base font-medium cursor-pointer">여의도오피스</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* 2단계: 날짜 선택 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-lg font-semibold">2단계: 날짜 선택</div>
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
                  disabled={!selectedOffice}
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
            {!selectedOffice && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                먼저 오피스를 선택해주세요
              </p>
            )}
          </CardContent>
        </Card>

        {/* 3단계: 좌석 선택 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-corporate-blue/10 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-corporate-blue" />
              </div>
              <div>
                <div className="text-lg font-semibold">3단계: 좌석 선택</div>
                <div className="text-sm text-muted-foreground font-normal">원하는 좌석을 선택해주세요</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!selectedOffice || !selectedDate ? (
              <div className="text-center text-muted-foreground py-8">
                먼저 오피스와 날짜를 선택해주세요
              </div>
            ) : (
              <>
                {/* 세로형 좌석 배치 */}
                <div className="flex justify-center">
                  <div className="grid grid-cols-4 gap-4 max-w-sm">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((seatNum) => {
                      const currentData = getCurrentOfficeData();
                      const isOccupied = currentData?.occupiedSeats.has(seatNum) || false;
                      const isSelected = selectedSeat === seatNum;
                      
                      return (
                        <Button
                          key={seatNum}
                          variant={isSelected ? "default" : isOccupied ? "secondary" : "outline"}
                          className="aspect-square text-base font-bold h-16 w-16 flex flex-col items-center justify-center"
                          disabled={isOccupied}
                          onClick={() => {
                            const newSeat = isSelected ? null : seatNum;
                            setSelectedSeat(newSeat);
                            if (!newSeat) setSelectedTimeSlots([]);
                          }}
                        >
                          <User className="h-4 w-4 mb-1" />
                          <span className="text-xs">{seatNum}</span>
                        </Button>
                      );
                    })}
                  </div>
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
              </>
            )}
          </CardContent>
        </Card>

        {/* 4단계: 시간 선택 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <div className="text-lg font-semibold">4단계: 시간 선택</div>
                <div className="text-sm text-muted-foreground font-normal">이용할 시간대를 선택해주세요 (여러 시간 선택 가능)</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!selectedSeat ? (
              <div className="text-center text-muted-foreground py-8">
                먼저 좌석을 선택해주세요
              </div>
            ) : (
              <>
                {/* Selected time slots display */}
                {selectedTimeSlots.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">선택된 시간대</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTimeSlots.map((time) => (
                        <div
                          key={time}
                          className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                        >
                          <span>{time}</span>
                          <button
                            onClick={() => toggleTimeSlot(time)}
                            className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time slots grid */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">이용 가능한 시간대</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTimeSlots.includes(time);
                      const isAvailable = selectedSeat ? isTimeSlotAvailable(time, selectedSeat) : false;
                      const isLunchTime = time === '12:00' || time === '12:30';
                      
                      return (
                        <Button
                          key={time}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          disabled={!isAvailable}
                          onClick={() => toggleTimeSlot(time)}
                          className={`h-14 text-sm font-medium transition-all ${
                            isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                          } ${
                            !isAvailable ? 'opacity-50' : ''
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-semibold">{time}</div>
                            {isLunchTime && (
                              <div className="text-xs opacity-60">점심시간</div>
                            )}
                            {!isAvailable && !isLunchTime && (
                              <div className="text-xs opacity-60">예약됨</div>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Info section */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">💡 편리한 팁:</span> 여러 시간대를 선택하여 연속된 시간 동안 좌석을 이용할 수 있습니다.
                  </p>
                </div>
              </>
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
                {selectedOffice && selectedDate && selectedSeat && selectedTimeSlots.length > 0 ? (
                  <div className="space-y-3 text-center">
                    <div className="text-lg">
                      <span className="font-medium text-muted-foreground">오피스:</span>
                      <span className="ml-2 font-semibold">{selectedOffice}</span>
                    </div>
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
                      <span className="font-medium text-muted-foreground">선택 좌석:</span>
                      <span className="ml-2 font-semibold">{selectedSeat}번 좌석</span>
                    </div>
                    <div className="text-lg">
                      <span className="font-medium text-muted-foreground">이용 시간:</span>
                      <span className="ml-2 font-semibold">{selectedTimeSlots.join(', ')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    위의 모든 단계를 완료해주세요
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleReservation}
                disabled={!selectedOffice || !selectedDate || !selectedSeat || selectedTimeSlots.length === 0}
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