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
  }

  static isConnected(): boolean {
    const tokens = this.getStoredTokens();
    return tokens?.access_token ? true : false;
  }

  static async exchangeCodeForTokens(code: string): Promise<void> {
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
}