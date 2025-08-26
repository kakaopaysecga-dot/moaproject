import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  MapPin, 
  Monitor, 
  Wifi, 
  Search,
  Filter,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  location: '판교오피스' | '여의도오피스';
  amenities: string[];
  available: boolean;
  currentBooking?: {
    time: string;
    user: string;
    purpose: string;
    status: 'ongoing' | 'upcoming' | 'completed';
  };
}

interface TimeSlot {
  time: string;
  available: boolean;
  roomId?: string;
  user?: string;
  purpose?: string;
}

export default function MeetingRoomDashboard() {
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<'판교오피스' | '여의도오피스' | 'all'>('all');
  const [capacityFilter, setCapacityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const meetingRooms: MeetingRoom[] = [
    // 판교오피스
    { id: 'pg1', name: '산토리니', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: false, currentBooking: { time: '09:00-11:00', user: '김*진', purpose: '프로젝트 회의', status: 'ongoing' } },
    { id: 'pg2', name: '다낭', capacity: 2, location: '판교오피스', amenities: ['모니터', 'WiFi'], available: true },
    { id: 'pg3', name: '괌', capacity: 4, location: '판교오피스', amenities: ['프로젝터', 'WiFi'], available: true },
    { id: 'pg4', name: '모리셔스', capacity: 20, location: '판교오피스', amenities: ['대형 프로젝터', 'WiFi', '화상회의', '음향시설'], available: false, currentBooking: { time: '14:00-16:00', user: '이*수', purpose: '전체 회의', status: 'upcoming' } },
    { id: 'pg5', name: '하와이', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: false, currentBooking: { time: '10:00-12:00', user: '박*영', purpose: '팀 미팅', status: 'ongoing' } },
    { id: 'pg6', name: '발리', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: false, currentBooking: { time: '11:00-13:00', user: '정*호', purpose: '기획 회의', status: 'ongoing' } },
    { id: 'pg7', name: '칸쿤', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'pg8', name: '이비자', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'pg9', name: '사이판', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'pg10', name: '제주', capacity: 12, location: '판교오피스', amenities: ['대형 모니터', 'WiFi', '화상회의'], available: false, currentBooking: { time: '15:00-17:00', user: '최*미', purpose: '워크샵', status: 'upcoming' } },
    { id: 'pg11', name: '타히티', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'pg12', name: '몰타', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'pg13', name: '몰디브', capacity: 8, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화상회의'], available: true },
    { id: 'pg14', name: '마요르카', capacity: 4, location: '판교오피스', amenities: ['모니터', 'WiFi'], available: true },
    { id: 'pg15', name: '팔라우', capacity: 5, location: '판교오피스', amenities: ['프로젝터', 'WiFi'], available: true },
    { id: 'pg16', name: '오키나와', capacity: 12, location: '판교오피스', amenities: ['대형 모니터', 'WiFi', '화상회의'], available: true },
    { id: 'pg17', name: '니스', capacity: 30, location: '판교오피스', amenities: ['대형 프로젝터', 'WiFi', '화상회의', '음향시설'], available: true },
    { id: 'pg18', name: '보홀', capacity: 8, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화상회의'], available: true },
    
    // 여의도오피스
    { id: 'yd1', name: '푸켓', capacity: 6, location: '여의도오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: false, currentBooking: { time: '09:30-11:30', user: '강*희', purpose: '기획 회의', status: 'ongoing' } },
    { id: 'yd2', name: '카프리', capacity: 6, location: '여의도오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: false, currentBooking: { time: '16:00-18:00', user: '조*린', purpose: '고객 미팅', status: 'upcoming' } },
    { id: 'yd3', name: '포지타노', capacity: 6, location: '여의도오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: false, currentBooking: { time: '10:30-12:30', user: '신*우', purpose: '개발 회의', status: 'ongoing' } },
    { id: 'yd4', name: '시칠리아', capacity: 6, location: '여의도오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'yd5', name: '보라카이', capacity: 15, location: '여의도오피스', amenities: ['대형 모니터', 'WiFi', '화상회의'], available: false, currentBooking: { time: '13:00-15:00', user: '윤*석', purpose: '세미나', status: 'upcoming' } },
    { id: 'yd6', name: '피지', capacity: 4, location: '여의도오피스', amenities: ['모니터', 'WiFi'], available: true },
    { id: 'yd7', name: '세부', capacity: 4, location: '여의도오피스', amenities: ['모니터', 'WiFi'], available: true }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
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

  const filteredRooms = meetingRooms.filter(room => {
    const locationMatch = selectedLocation === 'all' || room.location === selectedLocation;
    const capacityMatch = capacityFilter === 'all' || 
      (capacityFilter === 'small' && room.capacity <= 4) ||
      (capacityFilter === 'medium' && room.capacity >= 5 && room.capacity <= 10) ||
      (capacityFilter === 'large' && room.capacity > 10);
    const searchMatch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       room.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return locationMatch && capacityMatch && searchMatch;
  });

  const availableRooms = filteredRooms.filter(room => room.available);
  const getCurrentlyAvailableRooms = () => {
    return availableRooms.filter(room => {
      const nextSlot = getNextAvailableSlot();
      return nextSlot && room.available;
    });
  };

  const handleQuickMeeting = (room: MeetingRoom) => {
    const nextSlot = getNextAvailableSlot();
    if (!nextSlot) {
      toast({
        title: "퀵 미팅 예약 불가",
        description: "현재 시간에는 퀵 미팅을 예약할 수 없습니다.",
        variant: "destructive"
      });
      return;
    }

    const endTime = timeSlots[timeSlots.indexOf(nextSlot) + 1];
    toast({
      title: "퀵 미팅 예약 완료! ⚡",
      description: `${room.name} 회의실 ${nextSlot}-${endTime} 30분 예약이 완료되었습니다.`
    });
  };

  const getRoomScheduleForDay = (room: MeetingRoom): TimeSlot[] => {
    return timeSlots.map(time => ({
      time,
      available: room.available || !room.currentBooking || 
        !isTimeInBooking(time, room.currentBooking.time),
      roomId: room.id,
      user: room.currentBooking?.user,
      purpose: room.currentBooking?.purpose
    }));
  };

  const isTimeInBooking = (time: string, bookingTime: string): boolean => {
    const [start, end] = bookingTime.split('-');
    const timeIndex = timeSlots.indexOf(time);
    const startIndex = timeSlots.indexOf(start);
    const endIndex = timeSlots.indexOf(end);
    
    return timeIndex >= startIndex && timeIndex < endIndex;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* 모바일 헤더 */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/booking" className="p-2 -ml-2 hover:bg-muted/50 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold">회의실 대시보드</h1>
              <p className="text-xs text-muted-foreground">실시간 현황</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
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

      <div className="p-4 space-y-6">
        {/* 퀵 미팅 섹션 */}
        <Card className="border-0 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" />
              ⚡ 퀵 미팅 (30분)
            </CardTitle>
            <p className="text-sm text-muted-foreground">지금 즉시 사용 가능한 회의실</p>
          </CardHeader>
          <CardContent>
            {getCurrentlyAvailableRooms().length > 0 ? (
              <div className="space-y-3">
                {getCurrentlyAvailableRooms().slice(0, 3).map((room) => (
                  <Card key={room.id} className="border border-primary/20 bg-background/80">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{room.name}</h4>
                          <p className="text-sm text-muted-foreground">{room.location}</p>
                        </div>
                        <Badge variant="secondary" className="text-sm">
                          {room.capacity}인
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {getNextAvailableSlot()}-{timeSlots[timeSlots.indexOf(getNextAvailableSlot() || '') + 1]}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleQuickMeeting(room)}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        즉시 예약
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">현재 즉시 사용 가능한 회의실이 없습니다</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 필터 섹션 */}
        <Card className="border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-accent" />
              필터 및 검색
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="회의실 이름 또는 위치 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select value={selectedLocation} onValueChange={(value: string) => setSelectedLocation(value as '판교오피스' | '여의도오피스' | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="위치" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 위치</SelectItem>
                  <SelectItem value="판교오피스">판교오피스</SelectItem>
                  <SelectItem value="여의도오피스">여의도오피스</SelectItem>
                </SelectContent>
              </Select>
              <Select value={capacityFilter} onValueChange={setCapacityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="인원" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="small">1-4인</SelectItem>
                  <SelectItem value="medium">5-10인</SelectItem>
                  <SelectItem value="large">11인+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 타임테이블 섹션 */}
        <Card className="border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarIcon className="h-5 w-5 text-secondary" />
              실시간 타임테이블
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px] space-y-3">
                {/* 시간 헤더 */}
                <div className="grid grid-cols-[120px_repeat(19,_40px)] gap-1">
                  <div className="text-xs font-medium text-muted-foreground p-2">회의실</div>
                  {timeSlots.map((time) => (
                    <div key={time} className="text-xs text-center font-medium text-muted-foreground p-1">
                      {time.slice(0, 5)}
                    </div>
                  ))}
                </div>
                
                {/* 회의실 타임테이블 */}
                {filteredRooms.slice(0, 10).map((room) => {
                  const schedule = getRoomScheduleForDay(room);
                  return (
                    <div key={room.id} className="grid grid-cols-[120px_repeat(19,_40px)] gap-1 items-center">
                      <div className="bg-muted/30 rounded-lg p-2">
                        <div className="font-medium text-sm">{room.name}</div>
                        <div className="text-xs text-muted-foreground">{room.location}</div>
                        <Badge 
                          variant={room.available ? "secondary" : "destructive"} 
                          className="text-xs mt-1"
                        >
                          {room.available ? "가능" : "사용중"}
                        </Badge>
                      </div>
                      {schedule.map((slot, index) => {
                        const isCurrentTime = slot.time === getCurrentTimeSlot();
                        const isBooked = !slot.available && room.currentBooking && 
                          isTimeInBooking(slot.time, room.currentBooking.time);
                        
                        return (
                          <div
                            key={index}
                            className={`
                              h-12 rounded border transition-all duration-200
                              ${isCurrentTime ? 'ring-2 ring-primary' : ''}
                              ${isBooked ? 'bg-destructive/20 border-destructive/30' : 'bg-success/10 border-success/30'}
                            `}
                          >
                            {isBooked && (
                              <div className="h-full flex items-center justify-center">
                                <div className="w-1 h-1 bg-destructive rounded-full"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 회의실 목록 */}
        <Card className="border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                회의실 목록
              </div>
              <Badge variant="outline" className="text-sm">
                {filteredRooms.length}개
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredRooms.map((room) => (
                <Card key={room.id} className="border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{room.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {room.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {room.capacity}인
                          </div>
                        </div>
                      </div>
                      <Badge variant={room.available ? "secondary" : "destructive"}>
                        {room.available ? "사용가능" : "사용중"}
                      </Badge>
                    </div>

                    {room.currentBooking && (
                      <div className="bg-muted/30 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{room.currentBooking.purpose}</p>
                            <p className="text-xs text-muted-foreground">{room.currentBooking.user}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{room.currentBooking.time}</p>
                            <Badge 
                              variant={room.currentBooking.status === 'ongoing' ? 'destructive' : 'outline'}
                              className="text-xs"
                            >
                              {room.currentBooking.status === 'ongoing' ? '진행중' : '예정'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {room.amenities.slice(0, 3).map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.amenities.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {room.available && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleQuickMeeting(room)}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            퀵 예약
                          </Button>
                        )}
                        <Link to={`/booking/meeting-room?room=${room.id}`}>
                          <Button size="sm" variant="ghost">
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}