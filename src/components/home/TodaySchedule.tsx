import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
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
      <Card className="p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">오늘의 일정</h2>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">오늘 예정된 일정이 없습니다</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Calendar className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">오늘의 일정</h2>
            <p className="text-sm text-muted-foreground">
              {sortedSchedule.length}개의 일정
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {new Date().toLocaleDateString('ko-KR', { 
            month: 'short', 
            day: 'numeric',
            weekday: 'short'
          })}
        </Badge>
      </div>

      <div className="space-y-3">
        {sortedSchedule.map((item) => (
          <div
            key={item.id}
            className={cn(
              "p-4 rounded-lg border-l-4 bg-card hover:bg-muted/30 transition-all duration-200 cursor-pointer",
              getPriorityIndicator(item.priority),
              item.completed && "opacity-60"
            )}
            onClick={() => toggleScheduleItem(item.id)}
          >
            <div className="flex items-start gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-5 w-5 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleScheduleItem(item.id);
                }}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{getTypeIcon(item.type)}</span>
                  <h3 className={cn(
                    "font-medium text-sm",
                    item.completed && "line-through text-muted-foreground"
                  )}>
                    {item.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
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
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            완료: {sortedSchedule.filter(item => item.completed).length}개
          </span>
          <span>
            남은 일정: {sortedSchedule.filter(item => !item.completed).length}개
          </span>
        </div>
      </div>
    </Card>
  );
};