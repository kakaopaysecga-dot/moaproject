import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, Circle, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useScheduleStore } from '@/store/scheduleStore';
import { cn } from '@/lib/utils';

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'meeting': return '🤝';
    case 'task': return '📋';
    case 'reminder': return '⏰';
    case 'personal': return '🌟';
    default: return '📅';
  }
};

const getPriorityIndicator = (priority: string) => {
  switch (priority) {
    case 'high': return 'border-l-destructive';
    case 'medium': return 'border-l-warning';
    case 'low': return 'border-l-muted';
    default: return 'border-l-muted';
  }
};

export const TodaySchedule: React.FC = () => {
  const { todaySchedule, toggleScheduleItem } = useScheduleStore();
  
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  
  const sortedSchedule = [...todaySchedule].sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
  });

  const isUpcoming = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const scheduleTime = hour * 60 + minute;
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    return scheduleTime > currentTimeInMinutes;
  };

  const isPast = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const scheduleTime = hour * 60 + minute;
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    return scheduleTime < currentTimeInMinutes;
  };

  if (sortedSchedule.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">오늘의 일정</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <Card className="p-8 text-center border-dashed">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">오늘 예정된 일정이 없습니다</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">오늘의 일정</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString('ko-KR', { 
              year: 'numeric',
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{sortedSchedule.length}</div>
          <div className="text-xs text-muted-foreground">개 일정</div>
        </div>
      </div>

      <div className="grid gap-3">
        {sortedSchedule.map((item, index) => (
          <Card
            key={item.id}
            className={cn(
              "p-4 border-l-4 hover:shadow-md transition-all duration-200 cursor-pointer group",
              getPriorityIndicator(item.priority),
              item.completed && "opacity-60 bg-muted/20"
            )}
            onClick={() => toggleScheduleItem(item.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(item.type)}</span>
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  )}
                </div>
              
                <div className="flex-1">
                  <h3 className={cn(
                    "font-semibold text-foreground",
                    item.completed && "line-through text-muted-foreground"
                  )}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{item.time}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={cn(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  item.priority === 'high' && "bg-red-100 text-red-700",
                  item.priority === 'medium' && "bg-yellow-100 text-yellow-700", 
                  item.priority === 'low' && "bg-green-100 text-green-700"
                )}>
                  {item.priority === 'high' && '높음'}
                  {item.priority === 'medium' && '보통'}
                  {item.priority === 'low' && '낮음'}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t text-sm">
        <span className="text-muted-foreground">
          완료된 일정: <span className="font-semibold text-foreground">{sortedSchedule.filter(item => item.completed).length}</span>개
        </span>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Plus className="w-4 h-4 mr-1" />
          일정 추가
        </Button>
      </div>
    </div>
  );
};