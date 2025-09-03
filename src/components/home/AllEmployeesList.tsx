import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Calendar, MapPin } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  englishName: string;
  dept: string;
  currentLocation?: string;
  currentActivity?: string;
  status: 'available' | 'busy' | 'meeting' | 'away' | 'vacation';
  vacationInfo?: {
    startDate: string;
    endDate: string;
    type: 'annual' | 'sick' | 'personal' | 'parental';
    reason?: string;
  };
}

// 전체 직원 데이터 (확장된 버전)
const allEmployees: Employee[] = [
  {
    id: '1',
    name: '김민석',
    englishName: 'Maison.sun',
    dept: '총무팀',
    currentLocation: '판교아지트 산토리니회의실',
    currentActivity: '개발미팅중 (MOA 앱 개발 논의)',
    status: 'meeting'
  },
  {
    id: '2',
    name: '박서영',
    englishName: 'Luna.design',
    dept: '디자인팀',
    currentLocation: '판교아지트 발리회의실',
    currentActivity: 'UI/UX 디자인 작업중',
    status: 'available'
  },
  {
    id: '3',
    name: '이준호',
    englishName: 'Harry.2024',
    dept: '기획팀',
    currentLocation: '여의도오피스 푸켓회의실',
    currentActivity: '서비스 기획 회의',
    status: 'meeting'
  },
  {
    id: '4',
    name: '최수진',
    englishName: 'Grace.hr',
    dept: '인사팀',
    currentLocation: '판교아지트 하와이회의실',
    currentActivity: '신입사원 면접 진행',
    status: 'busy'
  },
  {
    id: '5',
    name: '정민우',
    englishName: 'Kevin.fin',
    dept: '재무팀',
    currentLocation: '여의도오피스 카프리회의실',
    currentActivity: '월말 정산 업무',
    status: 'busy'
  },
  {
    id: '6',
    name: '한예림',
    englishName: 'Coco.mkt',
    dept: '마케팅팀',
    currentLocation: '판교아지트 이비자회의실',
    currentActivity: '콘텐츠 제작 회의',
    status: 'available'
  },
  {
    id: '7',
    name: '송재혁',
    englishName: 'Jazz.sales',
    dept: '영업팀',
    currentLocation: '외부 고객사 (강남역)',
    currentActivity: '대기업 클라이언트 미팅',
    status: 'away'
  },
  {
    id: '8',
    name: '윤지혜',
    englishName: 'Nova.dev',
    dept: '개발팀',
    currentLocation: '판교아지트 몰디브회의실',
    currentActivity: '백엔드 API 개발중',
    status: 'available'
  },
  {
    id: '9',
    name: '임도영',
    englishName: 'Echo.code',
    dept: '개발팀',
    currentLocation: '판교아지트 제주회의실',
    currentActivity: '코드 리뷰 및 테스트',
    status: 'meeting'
  },
  {
    id: '10',
    name: '조민아',
    englishName: 'Aria.qa',
    dept: 'QA팀',
    currentLocation: '여의도오피스 시칠리아회의실',
    currentActivity: '앱 품질 테스트 진행',
    status: 'busy'
  },
  {
    id: '11',
    name: '강현수',
    englishName: 'Felix.sec',
    dept: '보안팀',
    currentLocation: '판교아지트 괌회의실',
    currentActivity: '시스템 보안 점검',
    status: 'available'
  },
  {
    id: '12',
    name: '이상진',
    englishName: 'Cloud.ops',
    dept: '운영팀',
    currentLocation: '재택근무 (성남시)',
    currentActivity: '서버 모니터링',
    status: 'available'
  },
  {
    id: '13',
    name: '김현재',
    englishName: 'Blake.creative',
    dept: '크리에이티브팀',
    currentLocation: '판교아지트 니스회의실',
    currentActivity: '브랜드 디자인 작업',
    status: 'available'
  },
  {
    id: '14',
    name: '박미란',
    englishName: 'Ocean.strategy',
    dept: '전략기획팀',
    currentLocation: '여의도오피스 보라카이회의실',
    currentActivity: '사업 전략 회의',
    status: 'meeting'
  },
  {
    id: '15',
    name: '정수호',
    englishName: 'Storm.data',
    dept: '데이터팀',
    currentLocation: '판교아지트 사이판회의실',
    currentActivity: '데이터 분석 작업',
    status: 'available'
  },
  {
    id: '16',
    name: '김태영',
    englishName: 'Phoenix.mobile',
    dept: '모바일팀',
    currentLocation: '판교아지트 오키나와회의실',
    currentActivity: '앱 개발 스프린트',
    status: 'meeting'
  },
  {
    id: '17',
    name: '이소영',
    englishName: 'Sage.content',
    dept: '콘텐츠팀',
    currentLocation: '여의도오피스 포지타노회의실',
    currentActivity: '콘텐츠 기획 미팅',
    status: 'meeting'
  },
  {
    id: '18',
    name: '박준영',
    englishName: 'River.infra',
    dept: '인프라팀',
    currentLocation: '판교아지트 타히티회의실',
    currentActivity: '서버 구축 작업',
    status: 'available'
  },
  // 휴가중인 직원들
  {
    id: '19',
    name: '신동현',
    englishName: 'Ocean.vacation',
    dept: '개발팀',
    currentLocation: '연차휴가',
    currentActivity: '가족여행',
    status: 'vacation',
    vacationInfo: {
      startDate: '2025-01-06',
      endDate: '2025-01-10',
      type: 'annual',
      reason: '가족여행 및 개인휴식'
    }
  },
  {
    id: '20',
    name: '최은영',
    englishName: 'Luna.off',
    dept: '마케팅팀',
    currentLocation: '병가',
    currentActivity: '치료 및 회복',
    status: 'vacation',
    vacationInfo: {
      startDate: '2025-01-02',
      endDate: '2025-01-07',
      type: 'sick',
      reason: '몸살감기 치료'
    }
  },
  {
    id: '21',
    name: '김도윤',
    englishName: 'Sky.parental',
    dept: '인사팀',
    currentLocation: '육아휴직',
    currentActivity: '신생아 돌봄',
    status: 'vacation',
    vacationInfo: {
      startDate: '2024-12-15',
      endDate: '2025-03-15',
      type: 'parental',
      reason: '둘째 아이 출산 및 육아'
    }
  },
  {
    id: '22',
    name: '이예진',
    englishName: 'Bloom.personal',
    dept: '디자인팀', 
    currentLocation: '개인사유 휴가',
    currentActivity: '개인 일정',
    status: 'vacation',
    vacationInfo: {
      startDate: '2025-01-08',
      endDate: '2025-01-12',
      type: 'personal',
      reason: '이사 및 개인 업무'
    }
  },
  {
    id: '23',
    name: '강민호',
    englishName: 'Storm.annual',
    dept: '영업팀',
    currentLocation: '연차휴가',
    currentActivity: '국내여행',
    status: 'vacation',
    vacationInfo: {
      startDate: '2025-01-09',
      endDate: '2025-01-15',
      type: 'annual',
      reason: '연말연시 휴식 및 재충전'
    }
  },
  // 추가 직원들
  {
    id: '24',
    name: '홍길동',
    englishName: 'Hong.classic',
    dept: '법무팀',
    currentLocation: '여의도오피스 카프리회의실',
    currentActivity: '계약서 검토',
    status: 'busy'
  },
  {
    id: '25',
    name: '김철수',
    englishName: 'Steel.support',
    dept: '고객지원팀',
    currentLocation: '판교아지트 제주회의실',
    currentActivity: '고객문의 응답',
    status: 'available'
  },
  {
    id: '26',
    name: '이영희',
    englishName: 'Hope.account',
    dept: '회계팀',
    currentLocation: '여의도오피스 포지타노회의실',
    currentActivity: '연말정산 준비',
    status: 'busy'
  },
  {
    id: '27',
    name: '박영수',
    englishName: 'Forest.research',
    dept: '연구개발팀',
    currentLocation: '판교아지트 몰타회의실',
    currentActivity: '신기술 연구',
    status: 'meeting'
  },
  {
    id: '28',
    name: '정하나',
    englishName: 'One.compliance',
    dept: '컴플라이언스팀',
    currentLocation: '여의도오피스 시칠리아회의실',
    currentActivity: '규정 검토',
    status: 'available'
  },
  {
    id: '29',
    name: '김미래',
    englishName: 'Future.innovation',
    dept: '혁신팀',
    currentLocation: '판교아지트 니스회의실',
    currentActivity: '신사업 기획',
    status: 'meeting'
  },
  {
    id: '30',
    name: '박현우',
    englishName: 'Present.relation',
    dept: '대외협력팀',
    currentLocation: '외부 (서울시청)',
    currentActivity: '정부기관 미팅',
    status: 'away'
  }
];

export const AllEmployeesList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // 부서 목록 추출
  const departments = Array.from(new Set(allEmployees.map(emp => emp.dept))).sort();

  // 필터링된 직원 목록
  const filteredEmployees = allEmployees.filter(employee => {
    const matchesSearch = searchQuery === '' || 
      employee.name.includes(searchQuery) ||
      employee.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.dept.includes(searchQuery);
    
    const matchesDept = selectedDept === 'all' || employee.dept === selectedDept;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'available': return 'bg-success/10 text-success border-success/20';
      case 'busy': return 'bg-warning/10 text-warning border-warning/20';
      case 'meeting': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'away': return 'bg-muted text-muted-foreground border-muted';
      case 'vacation': return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  const getStatusText = (status: Employee['status']) => {
    switch (status) {
      case 'available': return '업무중';
      case 'busy': return '바쁨';
      case 'meeting': return '회의중';
      case 'away': return '부재중';
      case 'vacation': return '휴가중';
    }
  };

  const getVacationTypeText = (type: string) => {
    switch (type) {
      case 'annual': return '연차휴가';
      case 'sick': return '병가';
      case 'personal': return '개인사유';
      case 'parental': return '육아휴직';
      default: return type;
    }
  };

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">전체 직원 현황</h2>
        <Users className="h-4 w-4 text-primary" />
        <Badge variant="outline" className="ml-auto">
          총 {filteredEmployees.length}명
        </Badge>
      </div>

      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="이름이나 부서로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Search className="h-5 w-5 text-muted-foreground mt-2.5" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger>
                <SelectValue placeholder="부서 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 부서</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="available">업무중</SelectItem>
                <SelectItem value="busy">바쁨</SelectItem>
                <SelectItem value="meeting">회의중</SelectItem>
                <SelectItem value="away">부재중</SelectItem>
                <SelectItem value="vacation">휴가중</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* 직원 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee, index) => (
          <Card 
            key={employee.id} 
            className="p-4 hover:shadow-lg transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="space-y-3">
              {/* 기본 정보 */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{employee.name}</h3>
                  <p className="text-sm text-muted-foreground">{employee.englishName}</p>
                  <p className="text-sm text-muted-foreground">{employee.dept}</p>
                </div>
                <Badge className={getStatusColor(employee.status)}>
                  {getStatusText(employee.status)}
                </Badge>
              </div>

              {/* 현재 위치 및 활동 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">위치:</span>
                  <span className="font-medium text-xs">{employee.currentLocation || '알 수 없음'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">현재:</span>
                  <span className="font-medium text-xs">{employee.currentActivity}</span>
                </div>
                
                {/* 휴가 정보 표시 */}
                {employee.status === 'vacation' && employee.vacationInfo && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="text-purple-700 font-medium">휴가 기간:</span>
                      </div>
                      <div className="text-sm text-purple-900 font-semibold ml-6">
                        {employee.vacationInfo.startDate} ~ {employee.vacationInfo.endDate}
                      </div>
                      <div className="text-sm ml-6">
                        <span className="text-purple-700 font-medium">유형:</span>
                        <span className="ml-2 text-purple-900">
                          {getVacationTypeText(employee.vacationInfo.type)}
                        </span>
                      </div>
                      {employee.vacationInfo.reason && (
                        <div className="text-sm ml-6">
                          <span className="text-purple-700 font-medium">사유:</span>
                          <span className="ml-2 text-purple-900">{employee.vacationInfo.reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 결과 없음 */}
      {filteredEmployees.length === 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-2">
            <Users className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium text-foreground">검색 결과가 없습니다</h3>
            <p className="text-muted-foreground">다른 검색어나 필터를 시도해보세요.</p>
          </div>
        </Card>
      )}
    </section>
  );
};