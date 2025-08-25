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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 border-t border-border z-40 safe-bottom md:hidden shadow-lg">
      <div className={`grid ${user?.isAdmin ? 'grid-cols-4' : 'grid-cols-3'} h-18 px-2`}>
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || 
            (path !== '/' && location.pathname.startsWith(path));
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 text-xs transition-all duration-300 active:scale-95 rounded-2xl mx-1 my-2',
                isActive 
                  ? 'text-white bg-gradient-to-br from-primary to-accent shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              )}
            >
              <Icon 
                className={cn(
                  'h-6 w-6',
                  isActive ? 'text-white' : ''
                )} 
              />
              <span className={cn(
                'font-medium text-xs',
                isActive ? 'text-white' : ''
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