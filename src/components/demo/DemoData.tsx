// 해커톤 데모용 향상된 데이터
export const enhancedDemoData = {
  // AI 분석 결과 시뮬레이션
  aiInsights: [
    {
      id: '1',
      type: 'efficiency',
      title: '업무 효율성 87% 향상',
      description: 'AI 검색으로 직원 찾기 시간이 평균 12분에서 2분으로 단축',
      impact: 'high',
      metrics: { before: 12, after: 2, improvement: 83 }
    },
    {
      id: '2',
      type: 'space',
      title: '공간 활용도 94% 달성',
      description: '스마트 예약 시스템으로 회의실 빈 시간 22% 감소',
      impact: 'high',
      metrics: { utilization: 94, reduction: 22 }
    },
    {
      id: '3',
      type: 'satisfaction',
      title: '직원 만족도 96% 달성',
      description: '간편한 모바일 인터페이스로 업무 편의성 크게 향상',
      impact: 'medium',
      metrics: { satisfaction: 96, adoption: 98 }
    }
  ],

  // 실시간 활동 데이터
  realtimeActivity: [
    {
      timestamp: new Date().toISOString(),
      type: 'search',
      user: '김민석',
      action: 'AI 검색으로 박서영님 찾기 완료',
      location: '판교아지트 → 발리회의실',
      duration: '1.2초'
    },
    {
      timestamp: new Date(Date.now() - 30000).toISOString(),
      type: 'booking',
      user: '이준호',
      action: '스마트오피스 5번석 예약',
      location: '여의도오피스',
      duration: '즉시'
    },
    {
      timestamp: new Date(Date.now() - 60000).toISOString(),
      type: 'meeting',
      user: '최수진',
      action: 'AI 추천으로 하와이회의실 예약',
      location: '판교아지트',
      duration: '0.8초'
    },
    {
      timestamp: new Date(Date.now() - 90000).toISOString(),
      type: 'optimization',
      user: 'AI 시스템',
      action: '공간 활용도 최적화 완료',
      location: '전체 오피스',
      duration: '실시간'
    }
  ],

  // 데모용 성공 지표
  successMetrics: {
    timeReduction: 85, // 시간 단축률
    spaceUtilization: 94, // 공간 활용도
    userSatisfaction: 96, // 사용자 만족도
    adoptionRate: 98, // 도입률
    costSaving: 42, // 비용 절감률
    errorReduction: 91 // 오류 감소율
  },

  // 기술 스택 하이라이트
  techHighlights: [
    {
      category: 'AI/ML',
      technologies: ['Real-time Search', 'Smart Matching', 'Predictive Analytics'],
      impact: '검색 정확도 99.2%'
    },
    {
      category: 'Frontend',
      technologies: ['React 18', 'TypeScript', 'Tailwind CSS'],
      impact: '모바일 친화적 UX'
    },
    {
      category: 'Architecture',
      technologies: ['Modern Web App', 'Progressive Enhancement', 'Offline Support'],
      impact: '99.9% 가용성'
    }
  ]
};

// 데모 시나리오별 스크립트
export const demoScenarios = {
  // 시나리오 1: AI 검색 데모
  aiSearch: {
    title: 'AI 인텔리전트 검색',
    description: '자연어로 직원을 찾고 즉시 미팅 예약',
    steps: [
      '김민석을 검색',
      '실시간 위치 및 일정 확인',
      '가능한 시간대 자동 매칭',
      '최적의 회의실 추천',
      '원클릭 미팅 예약'
    ],
    expectedTime: '30초',
    traditionalTime: '5-10분'
  },

  // 시나리오 2: 스마트 예약 데모
  smartBooking: {
    title: '지능형 공간 관리',
    description: '실시간 좌석 현황과 즉시 예약',
    steps: [
      '실시간 좌석 현황 확인',
      '사용 가능한 좌석 시각화',
      '원클릭 즉시 예약',
      '자동 알림 및 확인',
      '취소도 원클릭'
    ],
    expectedTime: '10초',
    traditionalTime: '2-5분'
  },

  // 시나리오 3: 업무 자동화 데모
  automation: {
    title: 'AI 업무 자동화',
    description: '요청사항 자동 분류 및 처리',
    steps: [
      '요청 사항 입력',
      'AI 자동 분류',
      '담당자 자동 배정',
      '진행 상황 실시간 추적',
      '완료 알림'
    ],
    expectedTime: '즉시',
    traditionalTime: '1-3일'
  }
};