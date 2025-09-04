import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "연결 복구됨",
        description: "인터넷 연결이 복구되었습니다.",
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "연결 끊김",
        description: "오프라인 모드로 전환되었습니다.",
        variant: "destructive"
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  if (isOnline) return null;

  return (
    <Card className="fixed top-20 left-4 right-4 p-4 bg-destructive/10 border-destructive/20 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WifiOff className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium text-destructive">오프라인 모드</p>
            <p className="text-sm text-muted-foreground">일부 기능이 제한됩니다.</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          재시도
        </Button>
      </div>
    </Card>
  );
};