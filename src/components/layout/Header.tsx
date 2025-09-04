import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Settings, User, Circle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LiveStatus } from '@/components/ui/LiveStatus';
export const Header: React.FC = () => {
  const {
    user,
    logout
  } = useAuthStore();
  const location = useLocation();
  if (!user) return null;
  return <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 border-b border-border safe-top shadow-sm">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-2xl text-primary tracking-tight">MOA</span>
            </Link>
            <LiveStatus className="flex-shrink-0" />
          </div>

          {/* User Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* User Info - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-3 text-right">
                <span className="text-sm font-medium text-foreground">{user.englishName || user.name}</span>
                <div className="flex items-center gap-1.5">
                  <Circle className="h-2 w-2 fill-success text-success flex-shrink-0" />
                  <span className="text-xs text-success font-medium">온라인</span>
                </div>
              </div>
            </div>

            {/* User Info - Mobile/Tablet */}
            <div className="lg:hidden flex items-center">
              <div className="flex items-center gap-2 text-right">
                <span className="text-sm font-medium text-foreground truncate max-w-[120px]">{user.englishName ? `${user.englishName}(${user.name})` : user.name}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              <Link to="/settings">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-muted/50 h-9 px-3 rounded-lg transition-colors">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">마이페이지</span>
                </Button>
              </Link>
              
              <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2 hover:bg-muted/50 h-9 px-3 rounded-lg transition-colors">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">로그아웃</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>;
};