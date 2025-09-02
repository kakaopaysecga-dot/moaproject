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
    <div className="min-h-screen bg-muted/30 font-sans">
      {/* Mobile device frame for desktop */}
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary md:max-w-sm md:mx-auto md:my-8 md:rounded-3xl md:border md:border-border/50 md:shadow-2xl md:overflow-hidden md:h-[800px] md:max-h-[90vh]">
        {user && <Header />}
        
        <main className={cn(
          'px-4',
          user ? 'pb-28 pt-4 md:pb-8' : 'py-8'
        )}>
          {children}
        </main>
        
        {user && <FooterNav />}
      </div>
    </div>
  );
};