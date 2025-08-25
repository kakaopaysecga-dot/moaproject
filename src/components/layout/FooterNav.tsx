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
    { icon: FileText, label: '나의 요청', path: '/requests' },
    { icon: Calendar, label: '예약', path: '/booking' },
    ...(user?.isAdmin ? [{ icon: Settings, label: '관리', path: '/admin' }] : [{ icon: Settings, label: '설정', path: '/settings' }]),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 border-t border-border z-40 safe-bottom md:hidden shadow-lg">
      <div className="grid grid-cols-4 h-20 px-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || 
            (path !== '/' && location.pathname.startsWith(path));
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center justify-center space-y-1.5 text-xs transition-all duration-300 active:scale-95 rounded-2xl mx-1 my-2 py-2',
                isActive 
                  ? 'text-white bg-gradient-to-br from-primary to-accent shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              )}
            >
              <Icon 
                className={cn(
                  'h-6 w-6 transition-all duration-300',
                  isActive ? 'text-white scale-110' : ''
                )} 
              />
              <span className={cn(
                'font-medium text-xs leading-tight',
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