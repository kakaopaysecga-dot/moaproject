# MOA - 카카오페이증권 업무관리 시스템

## 📖 프로젝트 개요

MOA(Meeting Office Assistant)는 카카오페이증권의 스마트오피스 예약 및 업무 요청 관리를 위한 React + TypeScript 기반 웹 애플리케이션입니다.

## 🚀 로컬 실행 방법

### 필수 조건
- Node.js 18+ 및 npm
- 모던 웹 브라우저 (Chrome, Firefox, Safari, Edge)

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. 의존성 설치
npm install

# 3. 개발 서버 시작
npm run dev

# 4. 브라우저에서 http://localhost:8080 접속
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 타입 체크
npm run type-check

# 린트 검사
npm run lint
```

## 📁 프로젝트 구조

```
src/
├── main.tsx                 # 애플리케이션 진입점
├── App.tsx                  # 라우팅 및 전역 상태 설정
├── types/                   # TypeScript 타입 정의
│   └── index.ts
├── routes/                  # 페이지 컴포넌트
│   ├── auth/
│   │   ├── Login.tsx       # 로그인 페이지
│   │   └── Signup.tsx      # 회원가입 페이지
│   ├── Home.tsx            # 홈 대시보드
│   └── [예약/요청 페이지들]
├── components/              # 재사용 가능한 컴포넌트
│   ├── ui/                 # shadcn/ui 기반 기본 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── Modal.tsx
│   │   └── FormField.tsx
│   └── layout/             # 레이아웃 컴포넌트
│       ├── Header.tsx
│       ├── FooterNav.tsx
│       └── Layout.tsx
├── store/                  # Zustand 상태 관리
│   ├── authStore.ts        # 인증 상태
│   ├── bookingStore.ts     # 예약 상태
│   └── requestsStore.ts    # 요청 관리 상태
├── services/               # API/데이터 서비스 레이어
│   ├── authService.ts      # 인증 서비스
│   ├── bookingService.ts   # 예약 서비스
│   ├── requestService.ts   # 요청 관리 서비스
│   └── storage.ts          # localStorage 래퍼
└── lib/                    # 유틸리티 함수
    └── date.ts             # 날짜 관련 유틸리티
```

## 🔐 인증 시스템

### 테스트 계정
- **관리자 계정**: 아이디 `1`, 비밀번호 `1`
  - Supreme 관리자 권한
  - 모든 관리 기능 접근 가능

### 일반 계정
- **이메일 형식**: `firstname.lastname@kakaopaysec.com`
- **도메인 제한**: `@kakaopaysec.com` 도메인만 허용
- **관리자 권한**: 이메일이 `admin.`으로 시작하는 경우 관리자 권한 부여

## 📋 주요 기능

### 🏢 예약 시스템
- **스마트오피스**: 오늘부터 3일 이내 좌석 예약
- **회의실**: 제한 없는 날짜 범위의 회의실 예약
- **실시간 현황**: 예약 가능한 좌석/회의실 및 시간대 표시

### 📝 요청 관리
- **명함 신청**: 개인정보 자동 입력 및 미리보기
- **주차 등록**: 차량번호 등록 신청
- **경조사 지원**: 결혼/장례 지원 신청
- **사무환경 개선**: 이미지 업로드 및 개선 요청
- **온도 조절**: 1시간 쿨다운이 있는 온도 조절 요청

### 👨‍💼 관리자 기능
- **요청 관리**: 대기/진행/완료 상태별 필터링
- **상태 변경**: 요청 처리 상태 업데이트
- **사용자 관리**: 사용자별 요청 현황 조회

## 🛠 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구 및 개발 서버
- **Tailwind CSS** - 유틸리티 CSS 프레임워크
- **shadcn/ui** - 재사용 가능한 UI 컴포넌트

### 상태 관리
- **Zustand** - 경량 상태 관리 라이브러리
- **React Query** - 서버 상태 관리 (추후 확장용)

### 라우팅 & 유틸리티
- **React Router DOM** - 클라이언트 사이드 라우팅
- **date-fns** - 날짜 유틸리티
- **Lucide React** - 아이콘 라이브러리

## 💾 데이터 저장

현재는 **localStorage 기반 Mock 시스템**을 사용하여 다음 데이터를 관리합니다:

- 사용자 인증 정보
- 예약 데이터
- 요청 데이터
- 온도 조절 요청 쿨다운

## 🔄 API 교체 가이드

현재 Mock 서비스를 실제 REST API로 교체하는 방법:

### 1. 서비스 레이어 수정
```typescript
// src/services/authService.ts 예시
export class AuthService {
  static async login(email: string, password: string): Promise<User> {
    // Mock 코드를 실제 API 호출로 교체
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('로그인에 실패했습니다.');
    }
    
    return response.json();
  }
}
```

### 2. 환경 변수 설정
```bash
# .env 파일 생성
VITE_API_BASE_URL=https://your-api-domain.com
VITE_ENV=production
```

### 3. Axios 설정 (선택사항)
```bash
npm install axios
```

## 🧪 테스트 시나리오

### 인증 테스트
- [x] 테스트 계정 (1/1) 로그인 → 관리자 권한 확인
- [x] 일반 계정 회원가입 → 도메인/형식 검증
- [x] 잘못된 도메인 입력 시 오류 메시지

### 예약 테스트
- [x] 스마트오피스 3일 초과 날짜 선택 시 제한
- [x] 타임슬롯 선택 → 확인 모달 → 예약 완료
- [x] 예약 후 상태 반영 및 UI 업데이트

### 요청 관리 테스트
- [x] 온도 조절 연속 요청 시 쿨다운 메시지
- [x] 이미지 업로드 후 환경 개선 요청 생성
- [x] 관리자 요청 상태 변경 반영

## 🚨 알려진 제한사항

1. **이미지 저장**: 현재 Object URL 사용, 새로고침 시 소실
2. **실시간 업데이트**: WebSocket 없이 페이지 새로고침 필요
3. **파일 업로드**: 서버 연동 없이 클라이언트 임시 저장
4. **주소 검색**: Kakao 주소 API 연동 대신 Mock 버튼

## 📈 추후 개발 계획

### Phase 2 - 백엔드 연동
- [ ] REST API 서버 구축
- [ ] 실제 파일 업로드 시스템
- [ ] 이메일 알림 시스템
- [ ] 실시간 알림 (WebSocket)

### Phase 3 - 고도화
- [ ] Kakao 주소 API 연동
- [ ] 다국어 지원 (i18n)
- [ ] PWA 지원
- [ ] E2E 테스트 (Playwright)
- [ ] 다크모드 토글

## 🤝 기여 방법

1. 이슈 생성 또는 기존 이슈 확인
2. 브랜치 생성: `git checkout -b feature/기능명`
3. 변경사항 커밋: `git commit -m "feat: 기능 설명"`
4. 푸시: `git push origin feature/기능명`
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 카카오페이증권의 내부 시스템으로 제한됩니다.
