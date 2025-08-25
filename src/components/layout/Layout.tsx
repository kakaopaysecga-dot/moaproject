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
    <div className="min-h-screen bg-background font-sans">
      {user && <Header />}
      
      <main className={cn(
        'container mx-auto px-4',
        user ? 'pb-20 md:pb-8' : ''
      )}>
        {children}
      </main>
      
      {user && <FooterNav />}
    </div>
  );
};