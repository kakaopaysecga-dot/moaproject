import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Calendar, Settings, Shield, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { TouchTarget } from '@/components/ui/TouchTarget';
import { cn } from '@/lib/utils';

export const FooterNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { triggerHaptic } = useHapticFeedback();

  if (!user) return null;

  // 홈, 예약, 설정/관리 3개 탭만 제공
  const navItems = [
    { 
      icon: Home, 
      label: '홈', 
      path: '/'
    },
    { 
      icon: Calendar, 
      label: '예약', 
      path: '/booking'
    },
    user?.isAdmin 
      ? { 
          icon: Shield, 
          label: '관리', 
          path: '/admin'
        }
      : { 
          icon: Settings, 
          label: '설정', 
          path: '/settings'
        }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-border/30 z-50 md:hidden">
      <div className="safe-bottom">
        <div className="grid grid-cols-3 h-20 px-2 py-2">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path || 
              (path !== '/' && location.pathname.startsWith(path));
            
            return (
              <TouchTarget key={path} size="lg" asChild>
                <Link
                  to={path}
                  onClick={() => triggerHaptic('light')}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-xl mx-1 transition-all duration-200 active:scale-95 relative group touch-manipulation',
                    isActive 
                      ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  )}
                >
                <div className="flex flex-col items-center space-y-1 py-2">
                  <Icon 
                    className={cn(
                      'h-5 w-5 transition-all duration-200',
                      isActive 
                        ? 'text-white' 
                        : 'text-muted-foreground group-hover:text-foreground'
                    )} 
                  />
                  <span className={cn(
                    'font-semibold text-xs leading-none',
                    isActive 
                      ? 'text-white' 
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}>
                    {label}
                  </span>
                </div>
                
                {/* 활성 상태 인디케이터 */}
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-white rounded-full"></div>
                )}
                </Link>
              </TouchTarget>
            );
          })}
        </div>
      </div>
    </nav>
  );
};