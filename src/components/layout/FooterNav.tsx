import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Calendar, Settings, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export const FooterNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  // 모든 사용자에게 4개 탭 고정 제공
  const navItems = [
    { 
      icon: Home, 
      label: '홈', 
      path: '/',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      icon: FileText, 
      label: '나의 요청', 
      path: '/requests',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      icon: Calendar, 
      label: '예약', 
      path: '/booking',
      gradient: 'from-purple-500 to-purple-600'
    },
    user?.isAdmin 
      ? { 
          icon: Shield, 
          label: '관리', 
          path: '/admin',
          gradient: 'from-red-500 to-red-600'
        }
      : { 
          icon: Settings, 
          label: '설정', 
          path: '/settings',
          gradient: 'from-gray-500 to-gray-600'
        }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-border/50 z-50 safe-bottom md:hidden">
      {/* 상단 인디케이터 라인 */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary"></div>
      
      <div className="grid grid-cols-4 h-20 px-2 py-2">
        {navItems.map(({ icon: Icon, label, path, gradient }) => {
          const isActive = location.pathname === path || 
            (path !== '/' && location.pathname.startsWith(path));
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center justify-center space-y-1.5 rounded-2xl mx-1 transition-all duration-300 active:scale-95 relative overflow-hidden',
                isActive 
                  ? `bg-gradient-to-br ${gradient} shadow-lg shadow-black/10` 
                  : 'hover:bg-muted/40 active:bg-muted/60'
              )}
            >
              {/* 활성 상태 배경 효과 */}
              {isActive && (
                <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
              )}
              
              <div className="relative z-10 flex flex-col items-center space-y-1.5">
                <Icon 
                  className={cn(
                    'h-6 w-6 transition-all duration-300',
                    isActive 
                      ? 'text-white drop-shadow-sm scale-110' 
                      : 'text-muted-foreground'
                  )} 
                />
                <span className={cn(
                  'font-semibold text-xs leading-none tracking-tight',
                  isActive 
                    ? 'text-white drop-shadow-sm' 
                    : 'text-muted-foreground'
                )}>
                  {label}
                </span>
              </div>
              
              {/* 활성 상태 닷 인디케이터 */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-sm"></div>
              )}
            </Link>
          );
        })}
      </div>
      
      {/* 하단 안전 영역 */}
      <div className="h-safe-bottom bg-white/50"></div>
    </nav>
  );
};