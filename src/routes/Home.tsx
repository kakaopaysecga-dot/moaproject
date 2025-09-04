import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { ServiceCards } from '@/components/home/ServiceCards';

import { AdminPanel } from '@/components/home/AdminPanel';
import { QuickActions } from '@/components/home/QuickActions';
import { RecentActivity } from '@/components/home/RecentActivity';
import { AIPeopleFinder } from '@/components/home/AIPeopleFinder';
import { TodaySchedule } from '@/components/home/TodaySchedule';
import { GoogleIntegration } from '@/components/home/GoogleIntegration';
import { GoogleCalendarSync } from '@/components/home/GoogleCalendarSync';
import { TemperatureControl } from '@/components/home/TemperatureControl';

export default function Home() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center container-padding">
        <div className="text-center spacing-group">
          <h1 className="text-3xl md:text-4xl font-bold">MOA에 오신 것을 환영합니다</h1>
          <p className="text-lg text-muted-foreground">로그인이 필요합니다.</p>
          <Button asChild size="lg">
            <Link to="/login">로그인</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-padding spacing-content pb-safe-bottom">
      <WelcomeSection 
        userEnglishName={user.englishName}
        userDept={user.dept}
        userBuilding={user.building}
        userWorkArea={user.workArea}
      />
      
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
          <h2 className="text-xl font-semibold text-foreground">관리자 도구</h2>
          <div className="spacing-items">
            <RecentActivity />
            <AdminPanel />
          </div>
        </section>
      )}
      
      {/* Footer Space for Mobile Navigation */}
      <div className="h-safe-bottom" />
    </div>
  );
}