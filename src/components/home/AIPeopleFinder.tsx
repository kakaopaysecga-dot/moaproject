import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Calendar, MapPin, Clock, MessageSquare } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  dept: string;
  currentLocation?: string;
  currentActivity?: string;
  availableSlots: string[];
  status: 'available' | 'busy' | 'meeting' | 'away';
}

// Mock data - 실제로는 API에서 가져올 데이터
const mockPeople: Person[] = [
  {
    id: '1',
    name: '김영수',
    dept: '기술본부',
    currentLocation: 'B동 201호',
    currentActivity: '개발팀 회의',
    availableSlots: ['14:00-15:00', '16:30-17:30'],
    status: 'meeting'
  },
  {
    id: '2',
    name: '박지은',
    dept: '마케팅팀',
    currentLocation: '자리에 없음',
    currentActivity: '외부미팅',
    availableSlots: ['15:00-16:00', '17:00-18:00'],
    status: 'away'
  },
  {
    id: '3',
    name: '이민호',
    dept: '기획팀',
    currentLocation: 'A동 301호',
    currentActivity: '업무 중',
    availableSlots: ['13:00-14:00', '15:30-16:30'],
    status: 'available'
  },
  {
    id: '4',
    name: '최수진',
    dept: '인사팀',
    currentLocation: 'C동 102호',
    currentActivity: '면접 진행',
    availableSlots: ['11:00-12:00'],
    status: 'busy'
  },
  {
    id: '5',
    name: '정태호',
    dept: '재무팀',
    currentLocation: 'A동 205호',
    currentActivity: '결산 업무',
    availableSlots: ['16:00-17:00', '17:30-18:30'],
    status: 'busy'
  },
  {
    id: '6',
    name: '한미라',
    dept: '법무팀',
    currentLocation: 'B동 305호',
    currentActivity: '계약서 검토',
    availableSlots: ['10:00-11:00', '14:30-15:30'],
    status: 'available'
  },
  {
    id: '7',
    name: '송준혁',
    dept: '영업팀',
    currentLocation: '외부 미팅',
    currentActivity: '고객사 방문',
    availableSlots: [],
    status: 'away'
  },
  {
    id: '8',
    name: '윤서연',
    dept: '디자인팀',
    currentLocation: 'D동 401호',
    currentActivity: 'UI/UX 디자인',
    availableSlots: ['13:30-14:30', '15:00-16:00'],
    status: 'available'
  },
  {
    id: '9',
    name: '임도현',
    dept: '기술본부',
    currentLocation: 'B동 301호',
    currentActivity: '코드 리뷰',
    availableSlots: ['11:30-12:30', '16:00-17:00'],
    status: 'available'
  },
  {
    id: '10',
    name: '조은아',
    dept: '품질관리팀',
    currentLocation: 'C동 201호',
    currentActivity: '테스트 진행',
    availableSlots: ['10:30-11:30'],
    status: 'busy'
  },
  {
    id: '11',
    name: '강민석',
    dept: '보안팀',
    currentLocation: 'A동 101호',
    currentActivity: '보안 점검',
    availableSlots: ['14:00-15:00', '17:00-18:00'],
    status: 'available'
  },
  {
    id: '12',
    name: '이상헌',
    dept: '운영팀',
    currentLocation: '휴가',
    currentActivity: '연차 사용',
    availableSlots: [],
    status: 'away'
  }
];

export const AIPeopleFinder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // 실제로는 AI API 호출 + 데이터베이스 조회
    setTimeout(() => {
      const results = mockPeople.filter(person => 
        person.name.includes(searchQuery) || 
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
    }
  };

  const getStatusText = (status: Person['status']) => {
    switch (status) {
      case 'available': return '업무중';
      case 'busy': return '바쁨';
      case 'meeting': return '회의중';
      case 'away': return '부재중';
    }
  };

  const scheduleMeeting = (person: Person, timeSlot: string) => {
    // 실제로는 회의 예약 API 호출
    alert(`${person.name}님과 ${timeSlot} 시간에 회의가 예약되었습니다.`);
  };

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">AI 사람찾기</h2>
        <Users className="h-4 w-4 text-primary" />
      </div>

      {/* 검색 입력 */}
      <Card className="p-4">
        <div className="flex gap-2">
          <Input
            placeholder="이름이나 부서를 입력하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* 로딩 상태 */}
      {isLoading && (
        <Card className="p-6">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">AI가 사람을 찾고 있습니다...</span>
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
                  <div>
                    <h3 className="font-semibold text-foreground">{person.name}</h3>
                    <p className="text-sm text-muted-foreground">{person.dept}</p>
                  </div>
                  <Badge className={getStatusColor(person.status)}>
                    {getStatusText(person.status)}
                  </Badge>
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
                          onClick={() => scheduleMeeting(person, slot)}
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
    </section>
  );
};