import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, FileText, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export const FooterNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const navItems = [
    { icon: Home, label: '홈', path: '/' },
    { icon: Calendar, label: '예약', path: '/booking' },
    { icon: FileText, label: '요청', path: '/requests' },
    ...(user?.isAdmin ? [{ icon: Settings, label: '관리', path: '/admin' }] : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border z-40 safe-bottom md:hidden">
      <div className={`grid ${user?.isAdmin ? 'grid-cols-4' : 'grid-cols-3'} h-16`}>
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || 
            (path !== '/' && location.pathname.startsWith(path));
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 text-xs transition-all duration-200 active:scale-95',
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground active:bg-muted/20'
              )}
            >
              <Icon 
                className={cn(
                  'h-5 w-5',
                  isActive && 'text-primary'
                )} 
              />
              <span className={cn(
                'font-medium',
                isActive ? 'text-primary' : ''
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};