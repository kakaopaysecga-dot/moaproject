import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface GoogleCalendarProps {
  isConnected?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}
export const GoogleCalendar: React.FC<GoogleCalendarProps> = ({
  isConnected = false,
  onConnect,
  onDisconnect
}) => {
  const {
    toast
  } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const handleGoogleAuth = async () => {
    if (isConnected) {
      onDisconnect?.();
      return;
    }
    setIsConnecting(true);
    try {
      // Create OAuth URL - using standardized client ID
      const clientId = '759409896984-a43f1m1d98aht31rmcmogud1ev7lvk6l.apps.googleusercontent.com';
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const scope = 'https://www.googleapis.com/auth/calendar.events';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + `client_id=${clientId}&` + `redirect_uri=${encodeURIComponent(redirectUri)}&` + `scope=${encodeURIComponent(scope)}&` + `response_type=code&` + `access_type=offline&` + `prompt=consent`;

      // Save callback state
      sessionStorage.setItem('google_auth_callback', 'true');

      // Redirect to Google
      window.location.href = authUrl;
    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: "연결 실패",
        description: "구글 캘린더 연결에 실패했습니다.",
        variant: "destructive"
      });
      setIsConnecting(false);
    }
  };
  return null;
};