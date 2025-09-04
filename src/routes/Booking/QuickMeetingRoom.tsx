import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Users, MapPin, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  location: '판교아지트' | '여의도오피스';
  amenities: string[];
  available: boolean;
}

export default function QuickMeetingRoom() {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedOffice, setSelectedOffice] = useState<'판교아지트' | '여의도오피스'>('판교아지트');
  const [bookedRooms, setBookedRooms] = useState<Set<string>>(new Set());

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

  const meetingRooms: MeetingRoom[] = [
    // 판교아지트
    { id: 'pg1', name: '산토리니', capacity: 6, location: '판교아지트', amenities: ['프로젝터', 'WiFi'], available: true },
    { id: 'pg2', name: '다낭', capacity: 2, location: '판교아지트', amenities: ['모니터', 'WiFi'], available: true },
    { id: 'pg3', name: '괌', capacity: 4, location: '판교아지트', amenities: ['프로젝터', 'WiFi'], available: true },
    { id: 'pg4', name: '칸쿤', capacity: 6, location: '판교아지트', amenities: ['프로젝터', 'WiFi'], available: true },
    { id: 'pg5', name: '이비자', capacity: 6, location: '판교아지트', amenities: ['프로젝터', 'WiFi'], available: true },
    
    // 여의도오피스
    { id: 'yd1', name: '시칠리아', capacity: 6, location: '여의도오피스', amenities: ['프로젝터', 'WiFi'], available: true },
    { id: 'yd2', name: '피지', capacity: 4, location: '여의도오피스', amenities: ['모니터', 'WiFi'], available: true },
    { id: 'yd3', name: '세부', capacity: 4, location: '여의도오피스', amenities: ['모니터', 'WiFi'], available: true },
  ];

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

  const availableRooms = meetingRooms.filter(room => 
    room.available && room.location === selectedOffice && !bookedRooms.has(room.id)
  );

  const handleQuickBooking = (room: MeetingRoom) => {
    const nextSlot = getNextAvailableSlot();
    if (!nextSlot) {
      toast({
        title: "예약할 수 없습니다",
        description: "현재 시간에는 퀵 예약이 불가능합니다.",
        variant: "destructive"
      });
      return;
    }

    // 회의실을 예약된 상태로 표시
    setBookedRooms(prev => new Set([...prev, room.id]));

    const endTime = timeSlots[timeSlots.indexOf(nextSlot) + 1];
    toast({
      title: "퀵 예약 완료! ⚡",
      description: `${room.name} 회의실이 ${nextSlot}-${endTime}에 예약되었습니다. 30분 후 자동으로 해제됩니다.`,
    });

    // 30분 후 자동으로 예약 해제 (실제로는 서버에서 관리해야 함)
    setTimeout(() => {
      setBookedRooms(prev => {
        const newSet = new Set(prev);
        newSet.delete(room.id);
        return newSet;
      });
    }, 30 * 60 * 1000); // 30분
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
            <h1 className="text-lg font-bold">지금 바로 회의</h1>
            <p className="text-sm text-muted-foreground">30분 퀵 예약 서비스</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-primary">
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
        <Card className="border-0 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">퀵 예약 시간</h3>
                <p className="text-sm text-muted-foreground">즉시 30분 사용</p>
              </div>
            </div>
            {getNextAvailableSlot() ? (
              <div className="bg-background/60 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-primary">
                  {getNextAvailableSlot()} - {timeSlots[timeSlots.indexOf(getNextAvailableSlot() || '') + 1]}
                </div>
                <div className="text-sm text-muted-foreground">예약 가능 시간</div>
              </div>
            ) : (
              <div className="bg-destructive/10 rounded-lg p-3 text-center">
                <AlertCircle className="h-5 w-5 text-destructive mx-auto mb-1" />
                <div className="text-sm text-destructive">현재 퀵 예약 불가</div>
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

        {/* 사용 가능한 회의실 */}
        <Card className="border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-5 w-5 text-green-600" />
              사용 가능한 회의실
              <Badge variant="secondary" className="ml-auto">
                {availableRooms.length}개
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableRooms.length > 0 ? (
              <div className="space-y-3">
                {availableRooms.map((room) => {
                  const isBooked = bookedRooms.has(room.id);
                  return (
                    <Card key={room.id} className={`border ${isBooked ? 'border-destructive/50 bg-destructive/5' : 'border-border/50'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className={`font-semibold ${isBooked ? 'text-muted-foreground' : ''}`}>
                              {room.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">{room.location}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">
                              {room.capacity}인
                            </Badge>
                            {isBooked && (
                              <Badge variant="destructive">
                                사용중
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className={`text-sm ${isBooked ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                            {room.amenities.join(', ')}
                          </span>
                        </div>

                        <Button 
                          className="w-full"
                          onClick={() => handleQuickBooking(room)}
                          disabled={!getNextAvailableSlot() || isBooked}
                          variant={isBooked ? "secondary" : "default"}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          {isBooked ? "사용중" : "바로 예약하기"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {meetingRooms.filter(room => room.location === selectedOffice).length === bookedRooms.size 
                    ? "모든 회의실이 사용중입니다" 
                    : `현재 ${selectedOffice}에서 사용 가능한 회의실이 없습니다`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 하단 안내 */}
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-4 text-center space-y-2">
            <div className="text-sm font-medium">💡 퀵 예약 안내</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• 클릭 한 번으로 30분 즉시 예약</div>
              <div>• 현재 시간 기준 다음 시간대부터 예약</div>
              <div>• 추가 시간이 필요하면 현장에서 연장 가능</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}