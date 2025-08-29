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
  
  const sortedSchedule = [...todaySchedule].sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
  });

  if (sortedSchedule.length === 0) {
    return (
      <section className="space-y-3 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">오늘의 일정</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground h-7 w-7 p-0">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <Card className="p-6 text-center border-dashed">
          <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">오늘 예정된 일정이 없습니다</p>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">오늘의 일정</h2>
          <p className="text-xs text-muted-foreground">
            {sortedSchedule.length}개 일정
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground h-7 w-7 p-0">
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-2">
        {sortedSchedule.map((item, index) => (
          <Card
            key={item.id}
            className={cn(
              "p-3 hover:shadow-sm transition-all duration-200 cursor-pointer group border-l-2",
              getPriorityIndicator(item.priority),
              item.completed && "opacity-60 bg-muted/10"
            )}
            onClick={() => toggleScheduleItem(item.id)}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">{getTypeIcon(item.type)}</span>
                {item.completed ? (
                  <CheckCircle2 className="w-3 h-3 text-success" />
                ) : (
                  <Circle className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-medium text-sm text-foreground truncate",
                  item.completed && "line-through text-muted-foreground"
                )}>
                  {item.title}
                </h3>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </div>
                  {item.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs h-5 px-2",
                  item.priority === 'high' && "bg-destructive/10 text-destructive border-destructive/20",
                  item.priority === 'medium' && "bg-warning/10 text-warning border-warning/20", 
                  item.priority === 'low' && "bg-success/10 text-success border-success/20"
                )}
              >
                {item.priority === 'high' && '높음'}
                {item.priority === 'medium' && '보통'}
                {item.priority === 'low' && '낮음'}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground">
        <span>
          완료: {sortedSchedule.filter(item => item.completed).length}개
        </span>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-6 text-xs">
          <Plus className="w-3 h-3 mr-1" />
          추가
        </Button>
      </div>
    </section>
  );
};