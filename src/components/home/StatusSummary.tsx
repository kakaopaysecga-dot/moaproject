import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Thermometer, CalendarCheck } from 'lucide-react';

export const StatusSummary: React.FC = () => {
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

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-0 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        {/* 현재 시간 & 다음 일정 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-lg font-bold text-foreground">{statusData.currentTime}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            다음: {statusData.nextMeeting}
          </div>
        </div>

        {/* 실시간 통계 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-accent" />
              <span className="text-sm text-muted-foreground">회의실</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {statusData.availableRooms}개 사용가능
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-success" />
              <span className="text-sm text-muted-foreground">온라인</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {statusData.peopleOnline}명
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};