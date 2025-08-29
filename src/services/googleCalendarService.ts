import { supabase } from '@/integrations/supabase/client';

export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
}

export class GoogleCalendarService {
  private static readonly STORAGE_KEY = 'google_calendar_tokens';
  private static readonly DEMO_MODE = true; // 시연용 모드

  // 시연용 샘플 이벤트들
  private static readonly SAMPLE_EVENTS = [
    {
      id: 'sample-1',
      summary: '팀 회의',
      start: { dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() },
      location: '회의실 A',
      htmlLink: 'https://calendar.google.com/calendar/event?eid=sample1'
    },
    {
      id: 'sample-2', 
      summary: '프로젝트 리뷰',
      start: { dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString() },
      location: '온라인',
      htmlLink: 'https://calendar.google.com/calendar/event?eid=sample2'
    },
    {
      id: 'sample-3',
      summary: '점심 약속',
      start: { dateTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString() },
      location: '강남역 맛집',
      htmlLink: 'https://calendar.google.com/calendar/event?eid=sample3'
    }
  ];

  static getStoredTokens() {
    try {
      const tokens = localStorage.getItem(this.STORAGE_KEY);
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  }

  static setStoredTokens(tokens: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens));
  }

  static clearStoredTokens() {
    localStorage.removeItem(this.STORAGE_KEY);
    // 시연용 이벤트들도 제거
    localStorage.removeItem('demo_calendar_events');
  }

  static isConnected(): boolean {
    if (this.DEMO_MODE) {
      const tokens = this.getStoredTokens();
      return tokens?.demo_connected === true;
    }
    const tokens = this.getStoredTokens();
    return tokens?.access_token ? true : false;
  }

  static async exchangeCodeForTokens(code: string): Promise<void> {
    if (this.DEMO_MODE) {
      // 시연용: 가짜 토큰 저장
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
      this.setStoredTokens({
        demo_connected: true,
        access_token: 'demo_token_' + Date.now(),
        refresh_token: 'demo_refresh_' + Date.now(),
        expires_in: 3600
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('google-calendar', {
        body: { code, action: 'exchange' }
      });

      if (error) throw error;
      
      if (data?.tokens) {
        this.setStoredTokens(data.tokens);
      }
    } catch (error) {
      console.error('Token exchange failed:', error);
      throw new Error('구글 인증에 실패했습니다.');
    }
  }

  static async createEvent(event: CalendarEvent): Promise<{ success: boolean; eventId?: string; htmlLink?: string }> {
    if (this.DEMO_MODE) {
      // 시연용: 가짜 이벤트 생성
      await new Promise(resolve => setTimeout(resolve, 800)); // 로딩 시뮬레이션
      
      const newEvent = {
        id: 'demo_event_' + Date.now(),
        summary: event.title,
        start: { dateTime: event.startTime },
        end: { dateTime: event.endTime },
        location: event.location || '',
        htmlLink: 'https://calendar.google.com/calendar/event?eid=demo' + Date.now()
      };

      // 로컬 스토리지에 저장
      const existingEvents = JSON.parse(localStorage.getItem('demo_calendar_events') || '[]');
      existingEvents.push(newEvent);
      localStorage.setItem('demo_calendar_events', JSON.stringify(existingEvents));

      return {
        success: true,
        eventId: newEvent.id,
        htmlLink: newEvent.htmlLink
      };
    }

    const tokens = this.getStoredTokens();
    if (!tokens?.access_token) {
      throw new Error('구글 캘린더에 먼저 연결해주세요.');
    }

    try {
      const { data, error } = await supabase.functions.invoke('google-calendar', {
        body: {
          action: 'create',
          tokens,
          event: {
            summary: event.title,
            description: event.description || '',
            location: event.location || '',
            start: {
              dateTime: event.startTime,
              timeZone: 'Asia/Seoul'
            },
            end: {
              dateTime: event.endTime,
              timeZone: 'Asia/Seoul'
            },
            reminders: {
              useDefault: true
            }
          }
        }
      });

      if (error) throw error;

      return {
        success: true,
        eventId: data?.eventId,
        htmlLink: data?.htmlLink
      };
    } catch (error) {
      console.error('Event creation failed:', error);
      return { success: false };
    }
  }

  static async getEvents(timeMin: string, timeMax: string): Promise<any[]> {
    if (this.DEMO_MODE) {
      // 시연용: 샘플 이벤트 + 사용자가 생성한 이벤트 반환
      await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
      
      const userEvents = JSON.parse(localStorage.getItem('demo_calendar_events') || '[]');
      const allEvents = [...this.SAMPLE_EVENTS, ...userEvents];
      
      // 시간 범위 내의 이벤트만 필터링
      return allEvents.filter(event => {
        const eventTime = new Date(event.start.dateTime);
        const minTime = new Date(timeMin);
        const maxTime = new Date(timeMax);
        return eventTime >= minTime && eventTime <= maxTime;
      });
    }

    const tokens = this.getStoredTokens();
    if (!tokens?.access_token) {
      return [];
    }

    try {
      const { data, error } = await supabase.functions.invoke('google-calendar', {
        body: {
          action: 'list',
          tokens,
          timeMin,
          timeMax
        }
      });

      if (error) throw error;
      return data?.events || [];
    } catch (error) {
      console.error('Failed to fetch events:', error);
      return [];
    }
  }

  static disconnect() {
    this.clearStoredTokens();
  }

  static getDemoMode(): boolean {
    return this.DEMO_MODE;
  }
}