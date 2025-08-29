import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, MapPin, Plus, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleCalendarService } from '@/services/googleCalendarService';

export const GoogleCalendarSync: React.FC = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsConnected(GoogleCalendarService.isConnected());
    if (GoogleCalendarService.isConnected()) {
      fetchTodayEvents();
    }
  }, []);

  const fetchTodayEvents = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const timeMin = today.toISOString();
      const timeMax = tomorrow.toISOString();
      
      const googleEvents = await GoogleCalendarService.getEvents(timeMin, timeMax);
      setEvents(googleEvents.slice(0, 3)); // Show only first 3 events
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestEvent = async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    try {
      const now = new Date();
      const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later
      
      const result = await GoogleCalendarService.createEvent({
        title: 'MOA 테스트 이벤트',
        description: 'MOA 앱에서 생성된 테스트 이벤트입니다.',
        location: 'MOA 오피스',
        startTime: now.toISOString(),
        endTime: endTime.toISOString()
      });

      if (result.success) {
        toast({
          title: "이벤트 생성됨",
          description: GoogleCalendarService.getDemoMode() 
            ? "시연용 구글 캘린더에 테스트 이벤트가 생성되었습니다."
            : "구글 캘린더에 테스트 이벤트가 생성되었습니다.",
        });
        
        // Open in Google Calendar (시연용에서는 알림만)
        if (result.htmlLink) {
          if (GoogleCalendarService.getDemoMode()) {
            toast({
              title: "🎉 시연 완료!",
              description: "실제 환경에서는 구글 캘린더가 열립니다.",
            });
          } else {
            window.open(result.htmlLink, '_blank');
          }
        }
        
        // Refresh events
        fetchTodayEvents();
      } else {
        throw new Error('이벤트 생성 실패');
      }
    } catch (error) {
      console.error('Event creation failed:', error);
      toast({
        title: "생성 실패",
        description: "이벤트 생성에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatEventTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">
            {GoogleCalendarService.getDemoMode() ? '구글 캘린더 (시연)' : '구글 캘린더'}
          </h3>
          <CheckCircle className="w-4 h-4 text-success" />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleCreateTestEvent}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-1" />
          테스트 이벤트
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="w-6 h-6 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground mt-2">동기화 중...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {GoogleCalendarService.getDemoMode() ? '시연용 구글 캘린더 일정' : '오늘의 구글 캘린더 일정'}
          </p>
          {events.map((event, index) => (
            <div key={index} className="p-3 bg-muted/30 rounded-lg border">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{event.summary}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    {event.start?.dateTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatEventTime(event.start.dateTime)}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                {event.htmlLink && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1"
                    onClick={() => {
                      if (GoogleCalendarService.getDemoMode()) {
                        toast({
                          title: "시연 모드",
                          description: "실제 환경에서는 구글 캘린더가 열립니다.",
                        });
                      } else {
                        window.open(event.htmlLink, '_blank');
                      }
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <Calendar className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">오늘 일정이 없습니다</p>
        </div>
      )}
    </Card>
  );
};