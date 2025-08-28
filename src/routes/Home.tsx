import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { ServiceCards } from '@/components/home/ServiceCards';
import { TemperatureControl } from '@/components/home/TemperatureControl';
import { AdminPanel } from '@/components/home/AdminPanel';

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
        userName={user.name}
        userDept={user.dept}
        userBuilding={user.building}
      />
      
      <ServiceCards />
      
      <TemperatureControl />
      
      {user.isAdmin && <AdminPanel />}
      
      {/* Footer Space for Mobile Navigation */}
      <div className="h-6" />
    </div>
  );
}