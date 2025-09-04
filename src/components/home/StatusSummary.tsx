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
    <Card className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">현재 시간</div>
            <div className="font-medium">{statusData.currentTime}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">다음 일정</div>
            <div className="font-medium text-sm">{statusData.nextMeeting}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-success" />
          <div>
            <div className="text-xs text-muted-foreground">사용 가능</div>
            <div className="font-medium">{statusData.availableRooms}개실</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-warning" />
          <div>
            <div className="text-xs text-muted-foreground">실내온도</div>
            <div className="font-medium">{statusData.temperature}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          <div>
            <div className="text-xs text-muted-foreground">접속중</div>
            <div className="font-medium">{statusData.peopleOnline}명</div>
          </div>
        </div>
      </div>
    </Card>
  );
};