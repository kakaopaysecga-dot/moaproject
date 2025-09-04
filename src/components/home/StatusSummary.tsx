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
  return;
};