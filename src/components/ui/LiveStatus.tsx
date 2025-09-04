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
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge 
        variant={isOnline ? "default" : "destructive"} 
        className="flex items-center gap-1"
      >
        {isOnline ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        {isOnline ? "온라인" : "오프라인"}
      </Badge>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Circle className="h-2 w-2 fill-current text-green-500" />
        {lastUpdated.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })} 업데이트
      </div>
    </div>
  );
};