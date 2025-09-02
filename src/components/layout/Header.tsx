import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Settings, User, Circle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 border-b border-border safe-top shadow-sm">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-2xl text-primary tracking-tight">MOA</span>
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {/* User Info - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{user.englishName || user.name}</span>
                  <div className="flex items-center gap-1">
                    <Circle className="h-2 w-2 fill-success text-success" />
                    <span className="text-xs text-success font-medium">온라인</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 h-5">
                    {user.dept}
                  </Badge>
                  <Badge variant="outline" className="text-xs px-2 py-0.5 h-5">
                    {user.building}
                  </Badge>
                  {user.workArea && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 h-5">
                      {user.workArea}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* User Info - Mobile/Tablet */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-foreground">{user.name}</span>
                <div className="flex items-center gap-1">
                  <Circle className="h-2 w-2 fill-success text-success" />
                  <span className="text-xs text-success">온라인</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Link to="/settings">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-2 hover:bg-muted/50 h-9 px-3 rounded-lg transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">마이페이지</span>
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={logout}
                className="flex items-center gap-2 hover:bg-muted/50 h-9 px-3 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">로그아웃</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};