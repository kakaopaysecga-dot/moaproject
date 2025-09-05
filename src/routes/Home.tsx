import React, { Suspense, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { ServiceCards } from '@/components/home/ServiceCards';
import { QuickActions } from '@/components/home/QuickActions';
import { AIPeopleFinder } from '@/components/home/AIPeopleFinder';
import { TodaySchedule } from '@/components/home/TodaySchedule';
import { StatusSummary } from '@/components/home/StatusSummary';
import { QuickStats } from '@/components/home/QuickStats';
import { PullToRefresh } from '@/components/ui/PullToRefresh';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

// Lazy load admin components for better performance
const AdminPanel = React.lazy(() => import('@/components/home/AdminPanel').then(module => ({ default: module.AdminPanel })));
const RecentActivity = React.lazy(() => import('@/components/home/RecentActivity').then(module => ({ default: module.RecentActivity })));

// Enhanced loading component for better UX
const LoadingCard = memo(() => (
  <SkeletonCard className="h-32" showAvatar={true} lines={2} />
));

export default function Home() {
  const { user } = useAuthStore();

  const handleRefresh = async () => {
    // 실제 데이터 새로고침 로직
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center container-padding">
        <div className="text-center spacing-group">
          <h1 className="text-2xl md:text-3xl font-bold">MOA에 오신 것을 환영합니다</h1>
          <p className="text-lg text-muted-foreground">로그인이 필요합니다.</p>
          <Button asChild size="lg">
            <Link to="/login">로그인</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="container-padding spacing-content pb-safe-bottom">
        <WelcomeSection 
          userEnglishName={user.englishName}
          userDept={user.dept}
          userBuilding={user.building}
          userWorkArea={user.workArea}
        />
      
      {/* 실시간 상태 요약 */}
      <StatusSummary />
      
      {/* 빠른 통계 */}
      <QuickStats />
      
      {/* 빠른 예약 */}
      <QuickActions />
      
      {/* AI 사람찾기 */}
      <AIPeopleFinder />
      
      {/* 서비스 메뉴 */}
      <ServiceCards />
      
      {/* 오늘의 일정 */}
      <TodaySchedule />
      
      {/* 관리자 전용 */}
      {user.isAdmin && (
        <section className="spacing-group">
          <h2 className="text-lg font-semibold text-foreground">관리자 도구</h2>
          <div className="spacing-items">
            <ErrorBoundary>
              <Suspense fallback={<LoadingCard />}>
                <RecentActivity />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary>
              <Suspense fallback={<LoadingCard />}>
                <AdminPanel />
              </Suspense>
            </ErrorBoundary>
          </div>
        </section>
      )}
      
      {/* Footer Space for Mobile Navigation */}
      <div className="h-safe-bottom" />
    </div>
    </PullToRefresh>
  );
}