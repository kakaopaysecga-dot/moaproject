import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, Circle, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useScheduleStore } from '@/store/scheduleStore';
import { cn } from '@/lib/utils';
import { GoogleCalendar } from '@/components/GoogleCalendar';
import { GoogleCalendarService } from '@/services/googleCalendarService';

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
  const [isGoogleConnected, setIsGoogleConnected] = React.useState(false);

  React.useEffect(() => {
    setIsGoogleConnected(GoogleCalendarService.isConnected());
  }, []);
  
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
          <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            추가
          </Button>
        </div>
        <div className="relative p-8 rounded-xl bg-muted/30 border-2 border-dashed border-muted-foreground/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl"></div>
          <div className="relative text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted-foreground/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-muted-foreground/60" />
            </div>
            <p className="text-sm text-muted-foreground">오늘 예정된 일정이 없습니다</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">오늘의 일정</h2>
            <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {sortedSchedule.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <GoogleCalendar 
              isConnected={isGoogleConnected}
              onConnect={() => setIsGoogleConnected(true)}
              onDisconnect={() => {
                GoogleCalendarService.disconnect();
                setIsGoogleConnected(false);
              }}
            />
            <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
              <Plus className="w-3 h-3 mr-1" />
              추가
            </Button>
          </div>
        </div>

      {/* Timeline Layout */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-muted-foreground/20 to-primary/20"></div>
        
        <div className="space-y-3">
          {sortedSchedule.map((item, index) => (
            <div
              key={item.id}
              className="relative pl-10 group animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline dot */}
              <div className={cn(
                "absolute left-2.5 w-3 h-3 rounded-full border-2 bg-background transition-all duration-200",
                item.completed 
                  ? "border-success bg-success" 
                  : "border-primary/40 group-hover:border-primary group-hover:scale-110"
              )}>
                {item.completed && (
                  <CheckCircle2 className="w-2 h-2 text-white absolute -top-0.5 -left-0.5" />
                )}
              </div>

              {/* Content card */}
              <div
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5",
                  item.completed 
                    ? "bg-muted/20 border-muted opacity-75" 
                    : "bg-background border-border hover:border-primary/30"
                )}
                onClick={() => toggleScheduleItem(item.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{getTypeIcon(item.type)}</span>
                      <h3 className={cn(
                        "font-medium text-sm",
                        item.completed 
                          ? "line-through text-muted-foreground" 
                          : "text-foreground"
                      )}>
                        {item.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono">{item.time}</span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium shrink-0",
                    item.priority === 'high' && "bg-destructive/10 text-destructive",
                    item.priority === 'medium' && "bg-warning/10 text-warning", 
                    item.priority === 'low' && "bg-success/10 text-success"
                  )}>
                    {item.priority === 'high' && '높음'}
                    {item.priority === 'medium' && '보통'}
                    {item.priority === 'low' && '낮음'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2 text-xs">
        <span className="text-muted-foreground">
          완료: <span className="font-medium text-success">{sortedSchedule.filter(item => item.completed).length}</span> / {sortedSchedule.length}
        </span>
        <div className="text-muted-foreground">
          {new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })}
        </div>
      </div>
    </section>
  );
};