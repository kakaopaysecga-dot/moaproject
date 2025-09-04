import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveStatusProps {
  className?: string;
}

export const LiveStatus: React.FC<LiveStatusProps> = ({ className }) => {
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

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        {isOnline ? (
          <>
            <Circle className="h-2 w-2 fill-success text-success animate-pulse" />
            <Wifi className="h-3 w-3 text-success" />
          </>
        ) : (
          <>
            <Circle className="h-2 w-2 fill-destructive text-destructive" />
            <WifiOff className="h-3 w-3 text-destructive" />
          </>
        )}
        <Badge 
          variant={isOnline ? "secondary" : "destructive"} 
          className="text-xs px-1 py-0"
        >
          {isOnline ? '실시간' : '오프라인'}
        </Badge>
      </div>
      
      <span className="text-xs text-muted-foreground">
        {lastUpdated.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </span>
    </div>
  );
};