import React from 'react';
import { Header } from './Header';
import { FooterNav } from './FooterNav';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { OfflineIndicator } from '@/components/ui/OfflineIndicator';
import { MobileKeyboardHandler } from '@/components/ui/MobileKeyboardHandler';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuthStore();

  return (
    <MobileKeyboardHandler>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary font-sans max-w-md mx-auto border-x border-border shadow-2xl">
        {user && <Header />}
        <OfflineIndicator />
        
        <main className={cn(
          'px-4',
          user ? 'pb-28 pt-4 md:pb-8' : 'py-8'
        )}>
          {children}
        </main>
        
        {user && <FloatingActionButton />}
        {user && <FooterNav />}
      </div>
    </MobileKeyboardHandler>
  );
};