import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 border-b border-border safe-top shadow-sm">
      <div className="px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl text-foreground">MOA</span>
          </Link>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-semibold text-foreground">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.dept}</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2 hover:bg-muted/50 h-10 px-3 rounded-xl"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">로그아웃</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};