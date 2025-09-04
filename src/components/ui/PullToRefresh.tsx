import React, { useState, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  className
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const threshold = 80;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;
    
    // 스크롤이 맨 위에 있고 아래로 당기는 경우만
    if (window.scrollY === 0 && distance > 0) {
      e.preventDefault();
      setIsPulling(true);
      setPullDistance(Math.min(distance, threshold + 20));
    }
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
  }, [pullDistance, threshold, onRefresh, isRefreshing]);

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      className={cn("relative", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-10",
          "bg-gradient-to-b from-background to-transparent",
          isPulling || isRefreshing ? "opacity-100" : "opacity-0"
        )}
        style={{ 
          height: isPulling || isRefreshing ? `${Math.max(pullDistance, 60)}px` : '0px'
        }}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw 
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isRefreshing ? "animate-spin" : ""
            )}
            style={{
              transform: isRefreshing ? 'rotate(0deg)' : `rotate(${progress * 360}deg)`
            }}
          />
          <span className="text-sm font-medium">
            {isRefreshing 
              ? "새로고침 중..." 
              : pullDistance >= threshold 
                ? "놓으면 새로고침" 
                : "아래로 당겨서 새로고침"
            }
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: isPulling ? `translateY(${pullDistance}px)` : 'translateY(0)',
          transition: isPulling ? 'none' : 'transform 0.2s ease'
        }}
      >
        {children}
      </div>
    </div>
  );
};