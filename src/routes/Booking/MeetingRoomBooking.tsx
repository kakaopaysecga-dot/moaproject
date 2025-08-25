import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, Users, MapPin, Monitor, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MeetingRoom {
  id: number;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
  available: boolean;
}

export default function MeetingRoomBooking() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null);
  const [attendees, setAttendees] = useState('');
  const [purpose, setPurpose] = useState('');

  // Mock data for meeting rooms
  const meetingRooms: MeetingRoom[] = [
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
    <div className="py-8 space-y-10">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-3xl font-bold tracking-tight">회의실 예약</h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
          팀 회의 및 미팅을 위한 회의실을 예약하세요
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
        {/* 예약 정보 입력 */}
        <div className="space-y-8">
          {/* 날짜 및 시간 */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                날짜 및 시간
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="date" className="text-sm font-semibold">예약 날짜</Label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="h-12">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">시작 시간</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="시작" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">종료 시간</Label>
                  <Select value={selectedEndTime} onValueChange={setSelectedEndTime}>
                    <SelectTrigger className="h-12">
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

          {/* 회의 정보 */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                회의 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="attendees" className="text-sm font-semibold">참석자 수</Label>
                <Input
                  id="attendees"
                  type="number"
                  placeholder="참석 예정 인원을 입력하세요"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="h-12"
                  min="1"
                  max="20"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="purpose" className="text-sm font-semibold">회의 목적</Label>
                <Textarea
                  id="purpose"
                  placeholder="회의 목적이나 내용을 간단히 적어주세요"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 회의실 선택 */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-corporate-blue/10 rounded-lg">
                <MapPin className="h-5 w-5 text-corporate-blue" />
              </div>
              회의실 선택
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {meetingRooms.map((room) => (
              <div
                key={room.id}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedRoom?.id === room.id
                    ? 'border-primary bg-primary/5'
                    : room.available
                    ? 'border-border hover:border-primary/50 hover:bg-muted/30'
                    : 'border-muted bg-muted/20 cursor-not-allowed opacity-60'
                }`}
                onClick={() => room.available && setSelectedRoom(room)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{room.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>최대 {room.capacity}명</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{room.location}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={room.available ? "default" : "secondary"}>
                    {room.available ? "이용 가능" : "사용 중"}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">편의시설</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg text-xs"
                      >
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 예약 확인 및 버튼 */}
      <Card className="shadow-lg border-0 max-w-6xl mx-auto">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-xl">예약 정보 확인</h3>
              <div className="text-base text-muted-foreground space-y-1">
                {selectedDate && selectedTime && selectedEndTime && selectedRoom && attendees && purpose ? (
                  <div className="space-y-2">
                    <div><strong>일시:</strong> {new Date(selectedDate).toLocaleDateString('ko-KR')} {selectedTime} - {selectedEndTime}</div>
                    <div><strong>회의실:</strong> {selectedRoom.name} ({selectedRoom.location})</div>
                    <div><strong>참석자:</strong> {attendees}명</div>
                    <div><strong>목적:</strong> {purpose}</div>
                  </div>
                ) : (
                  <p>모든 정보를 입력해주세요</p>
                )}
              </div>
            </div>
            <Button 
              onClick={handleReservation}
              disabled={!selectedDate || !selectedTime || !selectedEndTime || !selectedRoom || !attendees || !purpose}
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-accent to-corporate-blue hover:from-accent/90 hover:to-corporate-blue/90 shadow-lg lg:min-w-[200px]"
            >
              회의실 예약하기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 하단 여백 */}
      <div className="h-6" />
    </div>
  );
}