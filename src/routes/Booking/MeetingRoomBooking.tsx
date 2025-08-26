import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar as CalendarIcon, Clock, Users, MapPin, Monitor, Wifi, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  location: '판교오피스' | '여의도오피스';
  amenities: string[];
  available: boolean;
}

export default function MeetingRoomBooking() {
  const { toast } = useToast();
  const [selectedOffice, setSelectedOffice] = useState<'판교오피스' | '여의도오피스' | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null);
  const [attendees, setAttendees] = useState('');
  const [purpose, setPurpose] = useState('');

  const meetingRooms: MeetingRoom[] = [
    // 판교오피스
    { id: 'pg1', name: 'Santorini_산토리니_6인', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'pg2', name: 'Da Nang_다낭_2인', capacity: 2, location: '판교오피스', amenities: ['모니터', 'WiFi'], available: true },
    { id: 'pg3', name: 'Guam_괌_4인', capacity: 4, location: '판교오피스', amenities: ['프로젝터', 'WiFi'], available: true },
    { id: 'pg4', name: 'Mauritius_모리셔스_20인', capacity: 20, location: '판교오피스', amenities: ['대형 프로젝터', 'WiFi', '화상회의', '음향시설'], available: true },
    { id: 'pg5', name: 'Hawaii_하와이_6인', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'pg6', name: 'Bali_발리_6인', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'pg7', name: 'Cancun_칸쿤_6인', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'pg8', name: 'Ibiza_이비자_6인', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'pg9', name: 'Saipan_사이판_6인', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'pg10', name: 'Jeju_제주_12인', capacity: 12, location: '판교오피스', amenities: ['대형 모니터', 'WiFi', '화상회의'], available: true },
    { id: 'pg11', name: 'Tahiti_타히티_6인', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'pg12', name: 'Malta_몰타_6인', capacity: 6, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'pg13', name: 'Maldives_몰디브_8인', capacity: 8, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화상회의'], available: true },
    { id: 'pg14', name: 'Majorca_마요르카_4인', capacity: 4, location: '판교오피스', amenities: ['모니터', 'WiFi'], available: true },
    { id: 'pg15', name: 'Palau_팔라우_5인', capacity: 5, location: '판교오피스', amenities: ['프로젝터', 'WiFi'], available: true },
    { id: 'pg16', name: 'Okinawa_오키나와_12인', capacity: 12, location: '판교오피스', amenities: ['대형 모니터', 'WiFi', '화상회의'], available: true },
    { id: 'pg17', name: 'Nice_니스_20인(최대30인)', capacity: 30, location: '판교오피스', amenities: ['대형 프로젝터', 'WiFi', '화상회의', '음향시설'], available: true },
    { id: 'pg18', name: 'Bohol_보홀_8인', capacity: 8, location: '판교오피스', amenities: ['프로젝터', 'WiFi', '화상회의'], available: true },
    
    // 여의도오피스
    { id: 'yd1', name: 'Phuket_푸켓_6인', capacity: 6, location: '여의도오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'yd2', name: 'Capri_카프리_6인', capacity: 6, location: '여의도오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'yd3', name: 'Positano_포지타노_6인', capacity: 6, location: '여의도오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'yd4', name: 'Sicilia_시칠리아_6인', capacity: 6, location: '여의도오피스', amenities: ['프로젝터', 'WiFi', '화이트보드'], available: true },
    { id: 'yd5', name: 'Boracay_보라카이_15인', capacity: 15, location: '여의도오피스', amenities: ['대형 모니터', 'WiFi', '화상회의'], available: true },
    { id: 'yd6', name: 'Fiji_피지_4인', capacity: 4, location: '여의도오피스', amenities: ['모니터', 'WiFi'], available: true },
    { id: 'yd7', name: 'Cebu_세부_4인', capacity: 4, location: '여의도오피스', amenities: ['모니터', 'WiFi'], available: false }
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
    if (!selectedOffice || !selectedDate || !selectedTime || !selectedEndTime || !selectedRoom || !attendees || !purpose) {
      toast({
        title: "예약 정보가 부족합니다",
        description: "모든 필수 정보를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (selectedTime >= selectedEndTime) {
      toast({
        title: "시간 입력 오류",
        description: "종료 시간은 시작 시간보다 늦어야 합니다.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "예약이 완료되었습니다",
      description: `${selectedRoom.name}이 ${selectedDate} ${selectedTime}-${selectedEndTime}에 예약되었습니다.`
    });

    setSelectedOffice(null);
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
    <div className="py-6 space-y-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 px-2">
        <Link to="/booking">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-muted/50">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">회의실 예약</h1>
          <p className="text-muted-foreground text-sm mt-1">
            팀 회의 및 미팅을 위한 회의실을 예약하세요
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
                <div className="text-sm text-muted-foreground font-normal">회의실이 위치한 오피스를 선택해주세요</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">오피스 위치</Label>
              <RadioGroup value={selectedOffice || ''} onValueChange={(value) => {
                setSelectedOffice(value as '판교오피스' | '여의도오피스');
                setSelectedRoom(null); // Reset room selection when office changes
              }}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="판교오피스" id="pangyo" />
                    <Label htmlFor="pangyo" className="text-base font-medium cursor-pointer">판교오피스</Label>
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

        {/* 2단계: 날짜 및 시간 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-lg font-semibold">2단계: 날짜 및 시간 선택</div>
                <div className="text-sm text-muted-foreground font-normal">회의 일정을 선택해주세요</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">예약 날짜</Label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="날짜를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDates().map((date) => (
                    <SelectItem key={date} value={date}>
                      {new Date(date).toLocaleDateString('ko-KR', {
                        year: 'numeric',
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-base font-semibold">시작 시간</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="시작 시간" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-base font-semibold">종료 시간</Label>
                <Select value={selectedEndTime} onValueChange={setSelectedEndTime}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="종료 시간" />
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

        {/* 3단계: 회의 정보 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-corporate-blue/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-corporate-blue" />
              </div>
              <div>
                <div className="text-lg font-semibold">3단계: 회의 정보 입력</div>
                <div className="text-sm text-muted-foreground font-normal">회의 상세 정보를 입력해주세요</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">참석 예정 인원</Label>
              <Input
                type="number"
                placeholder="회의에 참석할 인원 수를 입력하세요"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="h-12 text-base"
                min="1"
                max="20"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-base font-semibold">회의 목적 및 내용</Label>
              <Textarea
                placeholder="회의의 목적이나 주요 내용을 간단히 적어주세요"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="min-h-[120px] resize-none text-base"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* 4단계: 회의실 선택 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <div className="text-lg font-semibold">4단계: 회의실 선택</div>
                <div className="text-sm text-muted-foreground font-normal">적합한 회의실을 선택해주세요</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedOffice ? (
              <div className="text-center text-muted-foreground py-8">
                먼저 오피스를 선택해주세요
              </div>
            ) : (
              <div className="space-y-3">
                {meetingRooms
                  .filter(room => room.location === selectedOffice)
                  .map((room) => (
                    <div
                      key={room.id}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
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
                            <span>최대 {room.capacity}명</span>
                          </div>
                        </div>
                        <Badge variant={room.available ? "default" : "secondary"} className="text-sm">
                          {room.available ? "이용 가능" : "사용 중"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">편의시설</h4>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg text-sm"
                            >
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
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
                {selectedOffice && selectedDate && selectedTime && selectedEndTime && selectedRoom && attendees && purpose ? (
                  <div className="space-y-3 text-center">
                    <div className="text-lg">
                      <span className="font-medium text-muted-foreground">오피스:</span>
                      <span className="ml-2 font-semibold">{selectedOffice}</span>
                    </div>
                    <div className="text-lg">
                      <span className="font-medium text-muted-foreground">예약 일시:</span>
                      <span className="ml-2 font-semibold">
                        {new Date(selectedDate).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        })} {selectedTime} - {selectedEndTime}
                      </span>
                    </div>
                    <div className="text-lg">
                      <span className="font-medium text-muted-foreground">선택 회의실:</span>
                      <span className="ml-2 font-semibold">{selectedRoom.name}</span>
                    </div>
                    <div className="text-lg">
                      <span className="font-medium text-muted-foreground">참석 인원:</span>
                      <span className="ml-2 font-semibold">{attendees}명</span>
                    </div>
                    <div className="text-lg">
                      <span className="font-medium text-muted-foreground">회의 목적:</span>
                      <span className="ml-2 font-semibold">{purpose}</span>
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
                disabled={!selectedOffice || !selectedDate || !selectedTime || !selectedEndTime || !selectedRoom || !attendees || !purpose}
                className="w-full h-14 text-lg font-semibold"
                size="lg"
              >
                회의실 예약 완료하기
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