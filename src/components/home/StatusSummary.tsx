import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Thermometer, CalendarCheck } from 'lucide-react';
import { useRequestsStore } from '@/store/requestsStore';
export const StatusSummary: React.FC = () => {
  const { loadRequests, initRealtime, cleanup, getPendingCount } = useRequestsStore();
  const pendingCount = getPendingCount();
  
  useEffect(() => {
    // 초기 데이터 로드
    loadRequests();
    // 실시간 업데이트 초기화
    initRealtime();
    
    // 클린업
    return () => {
      cleanup();
    };
  }, []);
  
  // 실시간 상태 정보
  const currentTime = new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const statusData = {
    currentTime,
    nextMeeting: "팀 회의 (14:00)",
    availableRooms: 12,
    temperature: "22°C",
    peopleOnline: 28
  };
  return <Card className="p-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">현재 시간</div>
            <div className="font-semibold truncate">{statusData.currentTime}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-2">
          <div className="p-2 rounded-lg bg-accent/10">
            <CalendarCheck className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">다음 일정</div>
            <div className="font-semibold text-sm truncate">{statusData.nextMeeting}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-2">
          <div className="p-2 rounded-lg bg-warning/10">
            <MapPin className="w-4 h-4 text-warning" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">요청 대기</div>
            <div className="font-semibold">{pendingCount}건</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-2">
          <div className="p-2 rounded-lg bg-success/10">
            <Thermometer className="w-4 h-4 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">실내 온도</div>
            <div className="font-semibold">{statusData.temperature}</div>
          </div>
        </div>
      </div>
    </Card>;
};