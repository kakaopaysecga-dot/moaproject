import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SuccessAnimation } from '@/components/ui/SuccessAnimation';
import { useScheduleStore } from '@/store/scheduleStore';
import { Search, Users, Calendar, MapPin, Clock, MessageSquare, X, CalendarPlus, Plane } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  englishName: string;
  dept: string;
  currentLocation?: string;
  currentActivity?: string;
  availableSlots: string[];
  status: 'available' | 'busy' | 'meeting' | 'away' | 'vacation';
  vacationInfo?: {
    startDate: string;
    endDate: string;
    reason?: string;
  };
}

// Mock data - 실제로는 API에서 가져올 데이터
const mockPeople: Person[] = [
  {
    id: '1',
    name: '김민석',
    englishName: 'Maison.sun',
    dept: '총무팀',
    currentLocation: '판교아지트 산토리니회의실',
    currentActivity: '개발미팅중 (MOA 앱 개발 논의)',
    availableSlots: ['14:00-15:00', '16:30-17:30'],
    status: 'meeting'
  },
  {
    id: '2',
    name: '박서영',
    englishName: 'Luna.design',
    dept: '디자인팀',
    currentLocation: '판교아지트 발리회의실',
    currentActivity: 'UI/UX 디자인 작업중',
    availableSlots: ['15:00-16:00', '17:00-18:00'],
    status: 'available'
  },
  {
    id: '3',
    name: '이준호',
    englishName: 'Harry.2024',
    dept: '기획팀',
    currentLocation: '여의도오피스 푸켓회의실',
    currentActivity: '서비스 기획 회의',
    availableSlots: ['13:00-14:00', '15:30-16:30'],
    status: 'meeting'
  },
  {
    id: '4',
    name: '최수진',
    englishName: 'Grace.hr',
    dept: '인사팀',
    currentLocation: '판교아지트 하와이회의실',
    currentActivity: '신입사원 면접 진행',
    availableSlots: ['11:00-12:00'],
    status: 'busy'
  },
  {
    id: '5',
    name: '정민우',
    englishName: 'Kevin.fin',
    dept: '재무팀',
    currentLocation: '여의도오피스 카프리회의실',
    currentActivity: '월말 정산 업무',
    availableSlots: ['16:00-17:00', '17:30-18:30'],
    status: 'busy'
  },
  {
    id: '6',
    name: '한예림',
    englishName: 'Coco.mkt',
    dept: '마케팅팀',
    currentLocation: '판교아지트 이비자회의실',
    currentActivity: '콘텐츠 제작 회의',
    availableSlots: ['10:00-11:00', '14:30-15:30'],
    status: 'available'
  },
  {
    id: '7',
    name: '송재혁',
    englishName: 'Jazz.sales',
    dept: '영업팀',
    currentLocation: '외부 고객사 (강남역)',
    currentActivity: '대기업 클라이언트 미팅',
    availableSlots: [],
    status: 'away'
  },
  {
    id: '8',
    name: '윤지혜',
    englishName: 'Nova.dev',
    dept: '개발팀',
    currentLocation: '판교아지트 몰디브회의실',
    currentActivity: '백엔드 API 개발중',
    availableSlots: ['13:30-14:30', '15:00-16:00'],
    status: 'available'
  },
  {
    id: '9',
    name: '임도영',
    englishName: 'Echo.code',
    dept: '개발팀',
    currentLocation: '판교아지트 제주회의실',
    currentActivity: '코드 리뷰 및 테스트',
    availableSlots: ['11:30-12:30', '16:00-17:00'],
    status: 'meeting'
  },
  {
    id: '10',
    name: '조민아',
    englishName: 'Aria.qa',
    dept: 'QA팀',
    currentLocation: '여의도오피스 시칠리아회의실',
    currentActivity: '앱 품질 테스트 진행',
    availableSlots: ['10:30-11:30'],
    status: 'busy'
  },
  {
    id: '19',
    name: '김휴가',
    englishName: 'Holiday.kim',
    dept: '개발팀',
    currentLocation: '휴가중',
    currentActivity: '연차휴가',
    availableSlots: [],
    status: 'vacation',
    vacationInfo: {
      startDate: '2024-12-01',
      endDate: '2024-12-05',
      reason: '연차휴가'
    }
  },
  {
    id: '20',
    name: '박연차',
    englishName: 'Vacation.park',
    dept: '마케팅팀',
    currentLocation: '휴가중',
    currentActivity: '여행',
    availableSlots: [],
    status: 'vacation',
    vacationInfo: {
      startDate: '2024-12-03',
      endDate: '2024-12-07',
      reason: '해외여행'
    }
  },
  {
    id: '11',
    name: '강현수',
    englishName: 'Felix.sec',
    dept: '보안팀',
    currentLocation: '판교아지트 괌회의실',
    currentActivity: '시스템 보안 점검',
    availableSlots: ['14:00-15:00', '17:00-18:00'],
    status: 'available'
  },
  {
    id: '12',
    name: '이상진',
    englishName: 'Cloud.ops',
    dept: '운영팀',
    currentLocation: '재택근무 (성남시)',
    currentActivity: '서버 모니터링',
    availableSlots: ['09:00-10:00', '16:00-17:00'],
    status: 'available'
  },
  {
    id: '13',
    name: '김현재',
    englishName: 'Blake.creative',
    dept: '크리에이티브팀',
    currentLocation: '판교아지트 니스회의실',
    currentActivity: '브랜드 디자인 작업',
    availableSlots: ['11:00-12:00', '15:00-16:00'],
    status: 'available'
  },
  {
    id: '14',
    name: '박미란',
    englishName: 'Ocean.strategy',
    dept: '전략기획팀',
    currentLocation: '여의도오피스 보라카이회의실',
    currentActivity: '사업 전략 회의',
    availableSlots: ['13:00-14:00'],
    status: 'meeting'
  },
  {
    id: '15',
    name: '정수호',
    englishName: 'Storm.data',
    dept: '데이터팀',
    currentLocation: '판교아지트 사이판회의실',
    currentActivity: '데이터 분석 작업',
    availableSlots: ['10:00-11:00', '16:30-17:30'],
    status: 'available'
  },
  {
    id: '16',
    name: '김태영',
    englishName: 'Phoenix.mobile',
    dept: '모바일팀',
    currentLocation: '판교아지트 오키나와회의실',
    currentActivity: '앱 개발 스프린트',
    availableSlots: ['14:30-15:30'],
    status: 'meeting'
  },
  {
    id: '17',
    name: '이소영',
    englishName: 'Sage.content',
    dept: '콘텐츠팀',
    currentLocation: '여의도오피스 포지타노회의실',
    currentActivity: '콘텐츠 기획 미팅',
    availableSlots: ['11:30-12:30', '17:00-18:00'],
    status: 'meeting'
  },
  {
    id: '18',
    name: '박준영',
    englishName: 'River.infra',
    dept: '인프라팀',
    currentLocation: '판교아지트 타히티회의실',
    currentActivity: '서버 구축 작업',
    availableSlots: ['09:30-10:30', '15:30-16:30'],
    status: 'available'
  }
];

// 회의실 데이터 - 실제 서비스 내 회의실 정보 반영
const meetingRooms = [
  // 판교아지트
  { id: '1', name: '산토리니', location: '판교아지트', capacity: 6 },
  { id: '2', name: '다낭', location: '판교아지트', capacity: 2 },
  { id: '3', name: '괌', location: '판교아지트', capacity: 4 },
  { id: '4', name: '모리셔스', location: '판교아지트', capacity: 20 },
  { id: '5', name: '하와이', location: '판교아지트', capacity: 6 },
  { id: '6', name: '발리', location: '판교아지트', capacity: 6 },
  { id: '7', name: '칸쿤', location: '판교아지트', capacity: 6 },
  { id: '8', name: '이비자', location: '판교아지트', capacity: 6 },
  { id: '9', name: '사이판', location: '판교아지트', capacity: 6 },
  { id: '10', name: '제주', location: '판교아지트', capacity: 12 },
  { id: '11', name: '타히티', location: '판교아지트', capacity: 6 },
  { id: '12', name: '몰타', location: '판교아지트', capacity: 6 },
  { id: '13', name: '몰디브', location: '판교아지트', capacity: 8 },
  { id: '14', name: '마요르카', location: '판교아지트', capacity: 4 },
  { id: '15', name: '팔라우', location: '판교아지트', capacity: 5 },
  { id: '16', name: '오키나와', location: '판교아지트', capacity: 12 },
  { id: '17', name: '니스', location: '판교아지트', capacity: 30 },
  { id: '18', name: '보홀', location: '판교아지트', capacity: 8 },
  
  // 여의도오피스
  { id: '19', name: '푸켓', location: '여의도오피스', capacity: 6 },
  { id: '20', name: '카프리', location: '여의도오피스', capacity: 6 },
  { id: '21', name: '포지타노', location: '여의도오피스', capacity: 6 },
  { id: '22', name: '시칠리아', location: '여의도오피스', capacity: 6 },
  { id: '23', name: '보라카이', location: '여의도오피스', capacity: 15 },
  { id: '24', name: '피지', location: '여의도오피스', capacity: 4 },
  { id: '25', name: '세부', location: '여의도오피스', capacity: 4 }
];

const locations = ['판교아지트', '여의도오피스'];

interface MeetingFormData {
  person: Person;
  timeSlot: string;
  selectedLocation: string;
  meetingRoom: string;
  title: string;
  content: string;
}

export const AIPeopleFinder: React.FC = () => {
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [previewResults, setPreviewResults] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  const [meetingForm, setMeetingForm] = useState<MeetingFormData>({
    person: {} as Person,
    timeSlot: '',
    selectedLocation: '',
    meetingRoom: '',
    title: '',
    content: ''
  });

  const { addScheduleItem } = useScheduleStore();

  // 실시간 검색 미리보기
  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    
    if (value.trim().length >= 2) {
      const results = mockPeople.filter(person => 
        person.name.includes(value) || 
        person.englishName.toLowerCase().includes(value.toLowerCase()) ||
        person.dept.includes(value)
      );
      setPreviewResults(results.slice(0, 3)); // 최대 3개만 미리보기
    } else {
      setPreviewResults([]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setPreviewResults([]); // 미리보기 숨기기
    
    // 실제로는 AI API 호출 + 데이터베이스 조회
    setTimeout(() => {
      const results = mockPeople.filter(person => 
        person.name.includes(searchQuery) || 
        person.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.dept.includes(searchQuery)
      );
      setSearchResults(results);
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: Person['status']) => {
    switch (status) {
      case 'available': return 'bg-success/10 text-success border-success/20';
      case 'busy': return 'bg-warning/10 text-warning border-warning/20';
      case 'meeting': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'away': return 'bg-muted text-muted-foreground border-muted';
      case 'vacation': return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  const getStatusText = (status: Person['status']) => {
    switch (status) {
      case 'available': return '업무중';
      case 'busy': return '바쁨';
      case 'meeting': return '회의중';
      case 'away': return '부재중';
      case 'vacation': return '휴가중';
    }
  };

  // 해당 시간에 사용 가능한 회의실 필터링
  const getAvailableRooms = (timeSlot: string) => {
    const [startTime] = timeSlot.split('-');
    
    // 해당 시간에 다른 사람들이 사용 중인 회의실 찾기
    const occupiedRooms = mockPeople
      .filter(person => person.status === 'meeting' || person.status === 'busy')
      .map(person => {
        if (person.currentLocation?.includes('회의실') || 
            person.currentLocation?.includes('스튜디오') || 
            person.currentLocation?.includes('실')) {
          return person.currentLocation.split(' ').pop(); // 마지막 단어 (회의실명)
        }
        return null;
      })
      .filter(Boolean);

    // 사용 가능한 회의실만 반환
    return meetingRooms.filter(room => {
      const isOccupied = occupiedRooms.some(occupiedRoom => 
        occupiedRoom?.includes(room.name.replace('회의실', '').replace('스튜디오', '').replace('실', ''))
      );
      return !isOccupied;
    });
  };

  const openMeetingModal = (person: Person, timeSlot: string) => {
    console.log('openMeetingModal called', { person: person.name, timeSlot });
    setMeetingForm({
      person,
      timeSlot,
      selectedLocation: '',
      meetingRoom: '',
      title: '',
      content: ''
    });
    console.log('Setting modal open to true');
    setIsModalOpen(true);
  };

  const handleMeetingSubmit = () => {
    if (!meetingForm.meetingRoom || !meetingForm.title) {
      alert('회의실과 회의 제목을 입력해주세요.');
      return;
    }

    // 실제로는 회의 예약 API 호출
    const selectedRoom = meetingRooms.find(room => room.id === meetingForm.meetingRoom);
    
    // 오늘의 일정에 회의 추가
    const [startTime] = meetingForm.timeSlot.split('-');
    const newScheduleItem = {
      id: `meeting_${Date.now()}`,
      title: `${meetingForm.title} (with ${meetingForm.person.name})`,
      time: startTime,
      type: 'meeting' as const,
      location: `${meetingForm.selectedLocation} ${selectedRoom?.name}`,
      priority: 'high' as const,
      completed: false
    };
    
    addScheduleItem(newScheduleItem);
    
    // 모달 닫기
    setIsModalOpen(false);
    
    // 성공 애니메이션 표시
    setSuccessMessage({
      title: "회의 예약 완료!",
      message: `${meetingForm.person.name}님과 ${meetingForm.timeSlot}에 ${selectedRoom?.name}에서 회의가 예약되었습니다. 오늘의 일정에 추가되었습니다.`
    });
    setShowSuccessAnimation(true);
    
    // 폼 초기화
    setMeetingForm({
      person: {} as Person,
      timeSlot: '',
      selectedLocation: '',
      meetingRoom: '',
      title: '',
      content: ''
    });
  };

  // 외부에서 검색창에 포커스를 줄 수 있도록 전역 함수 등록
  React.useEffect(() => {
    const focusSearchInput = () => {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 800); // 스크롤 완료 후 포커스
    };

    // 전역 이벤트 리스너 등록
    (window as any).focusPeopleFinderSearch = focusSearchInput;

    return () => {
      // 정리
      delete (window as any).focusPeopleFinderSearch;
    };
  }, []);

  return (
    <section id="ai-people-finder" className="space-y-4 animate-fade-in transition-all duration-300">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">AI 검색</h2>
        <Users className="h-4 w-4 text-primary" />
      </div>

      {/* 검색 입력 */}
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              ref={searchInputRef}
              placeholder="이름이나 부서를 입력하세요... (한글/영어 가능)"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* 실시간 미리보기 */}
          {previewResults.length > 0 && !isLoading && (
            <div className="border border-border rounded-lg bg-background/95 backdrop-blur-sm">
              {previewResults.map((person) => (
                <div
                  key={person.id}
                  className="p-3 hover:bg-muted/50 cursor-pointer border-b border-border last:border-b-0 transition-colors"
                  onClick={() => {
                    setSearchQuery(person.name);
                    setPreviewResults([]);
                    handleSearch();
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm flex items-center gap-1">
                        <span>{person.englishName}</span>
                        <span className="text-muted-foreground">({person.name})</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{person.dept}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {person.status === 'vacation' && (
                        <Plane className="h-3 w-3 text-blue-600" />
                      )}
                      <Badge className={getStatusColor(person.status)}>
                        {getStatusText(person.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* 로딩 상태 */}
      {isLoading && (
        <Card className="p-6">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">동료를 찾고 있습니다...</span>
          </div>
        </Card>
      )}

      {/* 검색 결과 */}
      {searchResults.length > 0 && (
        <div className="space-y-3">
          {searchResults.map((person, index) => (
            <Card 
              key={person.id} 
              className="p-4 hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-3">
                 {/* 기본 정보 */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{person.englishName}</h3>
                      <span className="text-sm text-muted-foreground">({person.name})</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{person.dept}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {person.status === 'vacation' && (
                      <Badge className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1">
                        <Plane className="h-3 w-3" />
                        휴가중
                      </Badge>
                    )}
                    {person.status !== 'vacation' && (
                      <Badge className={getStatusColor(person.status)}>
                        {getStatusText(person.status)}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* 현재 위치 및 활동 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">위치:</span>
                    <span className="font-medium">{person.currentLocation || '알 수 없음'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">현재:</span>
                    <span className="font-medium">{person.currentActivity}</span>
                  </div>
                </div>

                {/* 휴가 정보 */}
                {person.status === 'vacation' && person.vacationInfo && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">휴가 기간:</span>
                      <span className="font-medium text-blue-600">
                        {person.vacationInfo.startDate} ~ {person.vacationInfo.endDate}
                      </span>
                    </div>
                    {person.vacationInfo.reason && (
                      <div className="text-sm text-muted-foreground ml-6">
                        사유: {person.vacationInfo.reason}
                      </div>
                    )}
                  </div>
                )}

                {/* 비어있는 시간 */}
                {person.availableSlots.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">오늘 비어있는 시간:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {person.availableSlots.map((slot, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => openMeetingModal(person, slot)}
                          className="text-xs"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {person.availableSlots.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    오늘은 비어있는 시간이 없습니다.
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 검색 결과 없음 */}
      {searchQuery && !isLoading && searchResults.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">검색 결과가 없습니다.</p>
        </Card>
      )}

      {/* 회의 예약 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>회의 예약</DialogTitle>
            <DialogDescription>
              {meetingForm.person?.name}님과의 회의를 예약해보세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* 선택된 시간 */}
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">선택된 시간</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                오늘 {meetingForm.timeSlot}
              </p>
            </div>

            {/* 장소 선택 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">회의 장소 선택 *</label>
              <Select
                value={meetingForm.selectedLocation}
                onValueChange={(value) => setMeetingForm(prev => ({ ...prev, selectedLocation: value, meetingRoom: '' }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="장소를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 회의실 선택 */}
            {meetingForm.selectedLocation && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">회의실 선택 *</label>
                <Select
                  value={meetingForm.meetingRoom}
                  onValueChange={(value) => setMeetingForm(prev => ({ ...prev, meetingRoom: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="사용 가능한 회의실을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {getAvailableRooms(meetingForm.timeSlot)
                      .filter(room => room.location === meetingForm.selectedLocation)
                      .map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{room.name}</span>
                            <Badge variant="outline" className="text-xs px-1 py-0 bg-success/10 text-success border-success/20">
                              사용가능
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            최대 {room.capacity}명
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                    {getAvailableRooms(meetingForm.timeSlot).filter(room => room.location === meetingForm.selectedLocation).length === 0 && (
                      <div className="p-2 text-center text-muted-foreground text-sm">
                        해당 시간에 사용 가능한 회의실이 없습니다
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* 회의 제목 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">회의 제목 *</label>
              <Input
                placeholder="회의 제목을 입력하세요"
                value={meetingForm.title}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* 회의 내용 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">회의 내용</label>
              <Textarea
                placeholder="회의 내용을 입력하세요 (선택사항)"
                value={meetingForm.content}
                onChange={(e) => setMeetingForm(prev => ({ ...prev, content: e.target.value }))}
                rows={3}
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleMeetingSubmit}
                className="flex-1"
              >
                회의 예약
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 성공 애니메이션 */}
      <SuccessAnimation
        title={successMessage.title}
        message={successMessage.message}
        isVisible={showSuccessAnimation}
        onComplete={() => setShowSuccessAnimation(false)}
      />
    </section>
  );
};