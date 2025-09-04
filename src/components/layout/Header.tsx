import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  
  if (!user) return null;
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 border-b border-border safe-top shadow-sm">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-bold text-2xl text-primary tracking-tight">MOA</span>
          </Link>

          {/* Icon Actions */}
          <div className="flex items-center gap-1">
            <Link to="/settings">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 hover:bg-muted/50 rounded-lg transition-colors"
                title="마이페이지"
              >
                <User className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout} 
              className="h-9 w-9 hover:bg-muted/50 rounded-lg transition-colors"
              title="로그아웃"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};