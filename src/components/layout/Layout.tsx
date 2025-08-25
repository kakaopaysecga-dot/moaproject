import React from 'react';
import { Header } from './Header';
import { FooterNav } from './FooterNav';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-background font-sans md:max-w-md md:mx-auto md:border-x md:border-border">
      {user && <Header />}
      
      <main className={cn(
        'px-4',
        user ? 'pb-20 pt-4 md:pb-8' : 'py-8'
      )}>
        {children}
      </main>
      
      {user && <FooterNav />}
    </div>
  );
};