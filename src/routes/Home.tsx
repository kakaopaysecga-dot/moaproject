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

export default function Home() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">MOA에 오신 것을 환영합니다</h1>
          <p className="text-muted-foreground">로그인이 필요합니다.</p>
          <Button asChild>
            <Link to="/login">로그인</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <WelcomeSection 
        userEnglishName={user.englishName}
        userDept={user.dept}
        userBuilding={user.building}
        userWorkArea={user.workArea}
      />
      
      {/* 빠른 예약 */}
      <QuickActions />
      
      {/* 서비스 메뉴 */}
      <ServiceCards />
      
      {/* 오늘의 중요 정보 */}
      <div className="grid gap-4">
        <TodaySchedule />
        <AIPeopleFinder />
      </div>
      
      {/* 통합 서비스 */}
      <div className="grid gap-4">
        <GoogleIntegration />
        <GoogleCalendarSync />
      </div>
      
      {/* 관리자 전용 */}
      {user.isAdmin && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground px-1">관리자 도구</h2>
          <RecentActivity />
          <AdminPanel />
        </div>
      )}
      
      {/* Footer Space for Mobile Navigation */}
      <div className="h-6" />
    </div>
  );
}