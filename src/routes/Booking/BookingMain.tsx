import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Monitor, 
  Wifi,
  ChevronLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

// 스마트오피스 컴포넌트
const SmartOfficeTab = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('');

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

    setSelectedDate('');
    setSelectedSeat(null);
    setSelectedTime('');
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        {/* 날짜 선택 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarIcon className="h-5 w-5 text-primary" />
              날짜 선택
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getAvailableDates().map((date) => (
              <Button
                key={date}
                variant={selectedDate === date ? "default" : "outline"}
                className="w-full justify-between h-12"
                onClick={() => setSelectedDate(date)}
              >
                <span className="text-sm font-medium">
                  {new Date(date).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </span>
                {date === new Date().toISOString().split('T')[0] && (
                  <Badge variant="secondary" className="text-xs">오늘</Badge>
                )}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* 좌석 선택 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-accent" />
              좌석 선택
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((seatNum) => {
                const isOccupied = occupiedSeats.has(seatNum);
                const isSelected = selectedSeat === seatNum;
                
                return (
                  <Button
                    key={seatNum}
                    variant={isSelected ? "default" : isOccupied ? "secondary" : "outline"}
                    className="aspect-square p-0 text-sm font-bold"
                    disabled={isOccupied}
                    onClick={() => setSelectedSeat(isSelected ? null : seatNum)}
                  >
                    {seatNum}
                  </Button>
                );
              })}
            </div>
            
            <div className="bg-muted/30 p-3 rounded-lg space-y-2">
              <div className="text-xs font-semibold text-muted-foreground">좌석 상태</div>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border border-input rounded"></div>
                  <span>이용가능</span>
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
            </div>
          </CardContent>
        </Card>

        {/* 시간 선택 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-corporate-blue" />
              시간 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
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
                    className="h-9 text-sm"
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 예약 확인 */}
      <Card className="shadow-md border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">선택된 예약 정보</h3>
              <div className="text-sm text-muted-foreground">
                {selectedDate && selectedSeat && selectedTime ? (
                  <div className="space-y-1">
                    <div><span className="font-medium">날짜:</span> {new Date(selectedDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}</div>
                    <div><span className="font-medium">시간:</span> {selectedTime}</div>
                    <div><span className="font-medium">좌석:</span> {selectedSeat}번</div>
                  </div>
                ) : (
                  '날짜, 좌석, 시간을 모두 선택해주세요'
                )}
              </div>
            </div>
            <Button 
              onClick={handleReservation}
              disabled={!selectedDate || !selectedSeat || !selectedTime}
              className="h-12 px-8 text-base font-semibold md:min-w-[160px]"
            >
              좌석 예약하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 회의실 컴포넌트
const MeetingRoomTab = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [attendees, setAttendees] = useState('');
  const [purpose, setPurpose] = useState('');

  const meetingRooms = [
    {
      id: 1,
      name: '회의실 A',
      capacity: 8,
      location: '판교',
      amenities: ['프로젝터', 'WiFi', '화이트보드'],
      available: true
    },
    {
      id: 2,
      name: '회의실 B',
      capacity: 12,
      location: '판교',
      amenities: ['대형 모니터', 'WiFi', '화상회의'],
      available: true
    },
    {
      id: 3,
      name: '회의실 C',
      capacity: 6,
      location: '여의도',
      amenities: ['프로젝터', 'WiFi'],
      available: false
    },
    {
      id: 4,
      name: '회의실 D',
      capacity: 15,
      location: '여의도',
      amenities: ['대형 모니터', 'WiFi', '화상회의', '화이트보드'],
      available: true
    }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleReservation = () => {
    if (!selectedDate || !selectedTime || !selectedEndTime || !selectedRoom || !attendees || !purpose) {
      toast({
        title: "예약 정보 부족",
        description: "모든 필수 정보를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (selectedTime >= selectedEndTime) {
      toast({
        title: "시간 오류",
        description: "종료 시간은 시작 시간보다 늦어야 합니다.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "예약 완료",
      description: `${selectedRoom.name}이 ${selectedDate} ${selectedTime}-${selectedEndTime}에 예약되었습니다.`
    });

    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setSelectedEndTime('');
    setSelectedRoom(null);
    setAttendees('');
    setPurpose('');
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case '프로젝터':
      case '대형 모니터':
        return <Monitor className="h-4 w-4" />;
      case 'WiFi':
        return <Wifi className="h-4 w-4" />;
      default:
        return <div className="h-4 w-4 bg-muted rounded-full" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 예약 정보 입력 */}
        <div className="space-y-6">
          <Card className="shadow-md border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5 text-primary" />
                날짜 및 시간
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">예약 날짜</Label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="날짜를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableDates().map((date) => (
                      <SelectItem key={date} value={date}>
                        {new Date(date).toLocaleDateString('ko-KR', {
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short'
                        })}
                        {date === new Date().toISOString().split('T')[0] && ' (오늘)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">시작 시간</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="시작" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">종료 시간</Label>
                  <Select value={selectedEndTime} onValueChange={setSelectedEndTime}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="종료" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-accent" />
                회의 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">참석자 수</Label>
                <Input
                  type="number"
                  placeholder="참석 예정 인원"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="h-10"
                  min="1"
                  max="20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">회의 목적</Label>
                <Textarea
                  placeholder="회의 목적이나 내용을 간단히 적어주세요"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 회의실 선택 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-corporate-blue" />
              회의실 선택
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {meetingRooms.map((room) => (
              <div
                key={room.id}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedRoom?.id === room.id
                    ? 'border-primary bg-primary/5'
                    : room.available
                    ? 'border-border hover:border-primary/50 hover:bg-muted/30'
                    : 'border-muted bg-muted/20 cursor-not-allowed opacity-60'
                }`}
                onClick={() => room.available && setSelectedRoom(room)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{room.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span>최대 {room.capacity}명</span>
                      <span>{room.location}</span>
                    </div>
                  </div>
                  <Badge variant={room.available ? "default" : "secondary"} className="text-xs">
                    {room.available ? "이용 가능" : "사용 중"}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-md text-xs"
                    >
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 예약 확인 */}
      <Card className="shadow-md border-0">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">예약 정보 확인</h3>
              <div className="text-sm text-muted-foreground">
                {selectedDate && selectedTime && selectedEndTime && selectedRoom && attendees && purpose ? (
                  <div className="space-y-1">
                    <div><span className="font-medium">일시:</span> {new Date(selectedDate).toLocaleDateString('ko-KR')} {selectedTime} - {selectedEndTime}</div>
                    <div><span className="font-medium">회의실:</span> {selectedRoom.name} ({selectedRoom.location})</div>
                    <div><span className="font-medium">참석자:</span> {attendees}명</div>
                    <div><span className="font-medium">목적:</span> {purpose}</div>
                  </div>
                ) : (
                  '모든 정보를 입력해주세요'
                )}
              </div>
            </div>
            <Button 
              onClick={handleReservation}
              disabled={!selectedDate || !selectedTime || !selectedEndTime || !selectedRoom || !attendees || !purpose}
              className="h-12 px-8 text-base font-semibold lg:min-w-[160px]"
            >
              회의실 예약하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 메인 컴포넌트
export default function BookingMain() {
  return (
    <div className="py-6 space-y-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link to="/booking">
          <Button variant="ghost" size="sm" className="p-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold tracking-tight">예약하기</h1>
          <p className="text-muted-foreground text-sm mt-1">
            좌석 또는 회의실을 예약하세요
          </p>
        </div>
      </div>

      {/* 탭 */}
      <Tabs defaultValue="smart-office" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 p-1">
          <TabsTrigger value="smart-office" className="text-sm font-semibold">
            스마트오피스
          </TabsTrigger>
          <TabsTrigger value="meeting-room" className="text-sm font-semibold">
            회의실
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="smart-office" className="mt-8">
          <SmartOfficeTab />
        </TabsContent>
        
        <TabsContent value="meeting-room" className="mt-8">
          <MeetingRoomTab />
        </TabsContent>
      </Tabs>

      {/* 하단 여백 */}
      <div className="h-4" />
    </div>
  );
}