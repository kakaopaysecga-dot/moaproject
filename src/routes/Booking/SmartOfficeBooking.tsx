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
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [showReservationStatus, setShowReservationStatus] = useState(false);

  // Mock data for demonstration - separate for each office (10 seats total)
  const officeData = {
    '판교아지트': {
      occupiedSeats: new Set([2, 5, 8]),
      bookedTimeSlots: {
        '09:00': [1, 3],
        '09:30': [1, 3, 7],
        '15:00': [4, 6]
      },
      reservations: [
        { seat: 1, time: '09:00-12:00', user: '김*진', date: new Date().toISOString().split('T')[0] },
        { seat: 3, time: '09:00-11:00', user: '이*수', date: new Date().toISOString().split('T')[0] },
        { seat: 7, time: '14:00-18:00', user: '박*영', date: new Date().toISOString().split('T')[0] },
        { seat: 2, time: '10:00-16:00', user: '최*미', date: new Date().toISOString().split('T')[0] },
        { seat: 5, time: '13:00-17:00', user: '정*호', date: new Date().toISOString().split('T')[0] }
      ]
    },
    '여의도오피스': {
      occupiedSeats: new Set([1, 4, 6]),
      bookedTimeSlots: {
        '10:00': [2, 5],
        '10:30': [2, 5, 8],
        '14:00': [3, 7]
      },
      reservations: [
        { seat: 2, time: '10:00-14:00', user: '강*희', date: new Date().toISOString().split('T')[0] },
        { seat: 5, time: '10:00-15:00', user: '윤*석', date: new Date().toISOString().split('T')[0] },
        { seat: 8, time: '11:00-17:00', user: '조*린', date: new Date().toISOString().split('T')[0] },
        { seat: 1, time: '09:00-13:00', user: '신*우', date: new Date().toISOString().split('T')[0] },
        { seat: 4, time: '14:00-18:00', user: '한*아', date: new Date().toISOString().split('T')[0] }
      ]
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

  const getTimeSlotsBetween = (start: string, end: string): string[] => {
    const startIndex = timeSlots.indexOf(start);
    const endIndex = timeSlots.indexOf(end);
    
    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) return [];
    
    return timeSlots.slice(startIndex, endIndex + 1);
  };

  const handleTimeSlotClick = (time: string) => {
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

    if (!startTime) {
      // First click - set start time
      setStartTime(time);
      setEndTime(null);
      setSelectedTimeSlots([time]);
    } else if (!endTime) {
      // Second click - set end time and select range
      if (time === startTime) {
        // Same time clicked - reset
        setStartTime(null);
        setEndTime(null);
        setSelectedTimeSlots([]);
      } else {
        const timeBetween = getTimeSlotsBetween(startTime, time);
        
        // Check if all slots in range are available
        const unavailableSlots = timeBetween.filter(t => !isTimeSlotAvailable(t, selectedSeat));
        
        if (unavailableSlots.length > 0) {
          toast({
            title: "선택된 시간 범위에 예약된 시간이 있습니다",
            description: `${unavailableSlots.join(', ')} 시간대가 이미 예약되어 있습니다.`,
            variant: "destructive"
          });
          return;
        }
        
        setEndTime(time);
        setSelectedTimeSlots(timeBetween);
      }
    } else {
      // Third click - reset and start over
      setStartTime(time);
      setEndTime(null);
      setSelectedTimeSlots([time]);
    }
  };

  const handleQuickTimeSelection = (type: 'all-day' | 'morning' | 'afternoon') => {
    if (!selectedSeat) {
      toast({
        title: "좌석을 먼저 선택해주세요",
        description: "시간 선택 전에 좌석을 선택해야 합니다.",
        variant: "destructive"
      });
      return;
    }

    let start: string, end: string;
    
    switch (type) {
      case 'all-day':
        start = '09:00';
        end = '18:00';
        break;
      case 'morning':
        start = '09:00';
        end = '12:00';
        break;
      case 'afternoon':
        start = '13:00';
        end = '18:00';
        break;
      default:
        return;
    }

    const timeBetween = getTimeSlotsBetween(start, end);
    const unavailableSlots = timeBetween.filter(t => !isTimeSlotAvailable(t, selectedSeat));
    
    if (unavailableSlots.length > 0) {
      toast({
        title: "선택된 시간 범위에 예약된 시간이 있습니다",
        description: `${unavailableSlots.join(', ')} 시간대가 이미 예약되어 있습니다.`,
        variant: "destructive"
      });
      return;
    }
    
    setStartTime(start);
    setEndTime(end);
    setSelectedTimeSlots(timeBetween);
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

    const timeRange = startTime && endTime ? `${startTime} ~ ${endTime}` : selectedTimeSlots.join(', ');

    toast({
      title: "예약이 완료되었습니다",
      description: `${selectedOffice} ${selectedDate} ${selectedSeat}번 좌석 (${timeRange}) 예약이 완료되었습니다.`
    });

    // Reset form
    setSelectedOffice(null);
    setSelectedDate('');
    setSelectedSeat(null);
    setStartTime(null);
    setEndTime(null);
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
        {/* 예약 현황 */}
        <Card className="shadow-sm border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">📊 오늘의 예약 현황</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReservationStatus(!showReservationStatus)}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {showReservationStatus ? '숨기기' : '자세히 보기'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showReservationStatus && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(officeData).map(([office, data]) => (
                    <Card key={office} className="border-0 bg-muted/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">{office}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {data.reservations.map((reservation, index) => {
                          const now = new Date();
                          const [startTime, endTime] = reservation.time.split('-');
                          const startHour = parseInt(startTime.split(':')[0]);
                          const endHour = parseInt(endTime.split(':')[0]);
                          const currentHour = now.getHours();
                          
                          const isOngoing = currentHour >= startHour && currentHour < endHour;
                          const isUpcoming = currentHour < startHour;
                          
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-background/80 rounded-lg border border-border/50">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-primary">{reservation.seat}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{reservation.user}</span>
                                    <Badge 
                                      variant={isOngoing ? "default" : isUpcoming ? "secondary" : "outline"} 
                                      className="text-xs"
                                    >
                                      {isOngoing ? "진행중" : isUpcoming ? "예정" : "완료"}
                                    </Badge>
                                  </div>
                                  <div className="text-muted-foreground text-xs mt-1">{reservation.time}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {!showReservationStatus && (
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center border-0 bg-primary/5">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {officeData['판교아지트'].reservations.length}
                  </div>
                  <div className="text-sm text-muted-foreground">판교아지트 예약</div>
                </Card>
                <Card className="p-4 text-center border-0 bg-primary/5">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {officeData['여의도오피스'].reservations.length}
                  </div>
                  <div className="text-sm text-muted-foreground">여의도오피스 예약</div>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

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
                setStartTime(null);
                setEndTime(null);
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
                {/* 2x5 좌석 배치 */}
                <div className="flex justify-center">
                  <div className="flex items-center gap-8">
                    {/* 왼쪽 라벨 - 복도 */}
                    <div className="text-sm text-muted-foreground font-medium transform -rotate-90">
                      복도
                    </div>
                    
                    {/* 좌석 배치 */}
                    <div className="space-y-4">
                      {[1, 3, 5, 7, 9].map((leftSeat) => {
                        const rightSeat = leftSeat + 1;
                        
                        return (
                          <div key={leftSeat} className="flex gap-4">
                            {/* 왼쪽 좌석 */}
                            {[leftSeat].map((seatNum) => {
                              const currentData = getCurrentOfficeData();
                              const isOccupied = currentData?.occupiedSeats.has(seatNum) || false;
                              const isSelected = selectedSeat === seatNum;
                              
                              return (
                                <Button
                                  key={seatNum}
                                  variant={isSelected ? "default" : isOccupied ? "secondary" : "outline"}
                                  className="h-16 w-16 flex flex-col items-center justify-center text-sm font-bold"
                                  disabled={isOccupied}
                                  onClick={() => {
                                    const newSeat = isSelected ? null : seatNum;
                                    setSelectedSeat(newSeat);
                                    if (!newSeat) {
                                      setStartTime(null);
                                      setEndTime(null);
                                      setSelectedTimeSlots([]);
                                    }
                                  }}
                                >
                                  <User className="h-4 w-4 mb-1" />
                                  <span>{seatNum}</span>
                                </Button>
                              );
                            })}
                            
                            {/* 오른쪽 좌석 */}
                            {[rightSeat].map((seatNum) => {
                              const currentData = getCurrentOfficeData();
                              const isOccupied = currentData?.occupiedSeats.has(seatNum) || false;
                              const isSelected = selectedSeat === seatNum;
                              
                              return (
                                <Button
                                  key={seatNum}
                                  variant={isSelected ? "default" : isOccupied ? "secondary" : "outline"}
                                  className="h-16 w-16 flex flex-col items-center justify-center text-sm font-bold"
                                  disabled={isOccupied}
                                  onClick={() => {
                                    const newSeat = isSelected ? null : seatNum;
                                    setSelectedSeat(newSeat);
                                    if (!newSeat) {
                                      setStartTime(null);
                                      setEndTime(null);
                                      setSelectedTimeSlots([]);
                                    }
                                  }}
                                >
                                  <User className="h-4 w-4 mb-1" />
                                  <span>{seatNum}</span>
                                </Button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* 오른쪽 라벨 - 창가 */}
                    <div className="text-sm text-muted-foreground font-medium transform rotate-90">
                      창가
                    </div>
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
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-lg font-semibold">4단계: 시간 선택</div>
                <div className="text-sm text-muted-foreground font-normal">예약할 시간을 선택해주세요</div>
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
                {/* 빠른 선택 */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">빠른 선택</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleQuickTimeSelection('all-day')}
                      className="h-12 flex flex-col items-center justify-center text-xs space-y-1"
                    >
                      <div className="font-medium">전일</div>
                      <div className="text-muted-foreground">09:00-18:00</div>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleQuickTimeSelection('morning')}
                      className="h-12 flex flex-col items-center justify-center text-xs space-y-1"
                    >
                      <div className="font-medium">오전</div>
                      <div className="text-muted-foreground">09:00-12:00</div>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleQuickTimeSelection('afternoon')}
                      className="h-12 flex flex-col items-center justify-center text-xs space-y-1"
                    >
                      <div className="font-medium">오후</div>
                      <div className="text-muted-foreground">13:00-18:00</div>
                    </Button>
                  </div>
                </div>

                {/* 타임테이블 */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">시간 타임테이블</Label>
                  <Card className="border-0 bg-muted/20">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 gap-4">
                        {/* 오전 시간대 */}
                        <div className="space-y-3">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            오전 (AM)
                          </div>
                          <div className="grid grid-cols-6 gap-2">
                            {timeSlots.filter(time => parseInt(time.split(':')[0]) < 12).map((time) => {
                              const isAvailable = isTimeSlotAvailable(time, selectedSeat);
                              const isSelected = selectedTimeSlots.includes(time);
                              const isStart = startTime === time;
                              const isEnd = endTime === time;
                              
                              return (
                                <Button
                                  key={time}
                                  variant={isSelected ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleTimeSlotClick(time)}
                                  disabled={!isAvailable}
                                  className={`
                                    h-10 text-xs transition-all duration-200
                                    ${isStart ? 'ring-2 ring-primary ring-offset-1' : ''}
                                    ${isEnd ? 'ring-2 ring-secondary ring-offset-1' : ''}
                                    ${!isAvailable ? 'opacity-30 cursor-not-allowed bg-destructive/10' : ''}
                                  `}
                                >
                                  {time}
                                </Button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 오후 시간대 */}
                        <div className="space-y-3 pt-2 border-t border-border/50">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            오후 (PM)
                          </div>
                          <div className="grid grid-cols-6 gap-2">
                            {timeSlots.filter(time => parseInt(time.split(':')[0]) >= 12).map((time) => {
                              const isAvailable = isTimeSlotAvailable(time, selectedSeat);
                              const isSelected = selectedTimeSlots.includes(time);
                              const isStart = startTime === time;
                              const isEnd = endTime === time;
                              
                              return (
                                <Button
                                  key={time}
                                  variant={isSelected ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleTimeSlotClick(time)}
                                  disabled={!isAvailable}
                                  className={`
                                    h-10 text-xs transition-all duration-200
                                    ${isStart ? 'ring-2 ring-primary ring-offset-1' : ''}
                                    ${isEnd ? 'ring-2 ring-secondary ring-offset-1' : ''}
                                    ${!isAvailable ? 'opacity-30 cursor-not-allowed bg-destructive/10' : ''}
                                  `}
                                >
                                  {time}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* 범례 */}
                      <div className="flex flex-wrap gap-4 pt-4 mt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 bg-primary rounded-sm"></div>
                          <span>선택됨</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 bg-destructive/20 rounded-sm"></div>
                          <span>예약불가</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 border border-border rounded-sm"></div>
                          <span>선택가능</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 선택된 시간 표시 */}
                {selectedTimeSlots.length > 0 && (
                  <Card className="border-0 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-primary">선택된 시간</div>
                          <div className="text-muted-foreground text-xs mt-1">
                            {startTime && endTime ? `${startTime} ~ ${endTime}` : selectedTimeSlots.join(', ')}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setStartTime(null);
                            setEndTime(null);
                            setSelectedTimeSlots([]);
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
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
                      <span className="ml-2 font-semibold">
                        {startTime && endTime ? `${startTime} ~ ${endTime}` : selectedTimeSlots.join(', ')}
                      </span>
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