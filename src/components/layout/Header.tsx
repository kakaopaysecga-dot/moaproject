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
        
      </div>
    </header>;
};