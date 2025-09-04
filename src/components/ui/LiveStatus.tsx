import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
interface LiveStatusProps {
  className?: string;
}
export const LiveStatus: React.FC<LiveStatusProps> = ({
  className
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 실시간 업데이트 시뮬레이션
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // 30초마다 업데이트

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);
  return;
};