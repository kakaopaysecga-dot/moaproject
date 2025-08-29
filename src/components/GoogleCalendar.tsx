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
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleGoogleAuth = async () => {
    if (isConnected) {
      onDisconnect?.();
      return;
    }

    setIsConnecting(true);
    try {
      // Create OAuth URL
      const clientId = '1051442977730-v89g77dk2fh98t9t41rnj8b9q2u8emep.apps.googleusercontent.com';
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const scope = 'https://www.googleapis.com/auth/calendar.events';
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent`;

      // Save callback state
      sessionStorage.setItem('google_auth_callback', 'true');
      
      // Redirect to Google
      window.location.href = authUrl;
    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: "연결 실패",
        description: "구글 캘린더 연결에 실패했습니다.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <>
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            연결됨
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGoogleAuth}
            className="h-8 px-3 text-xs"
          >
            연결 해제
          </Button>
        </>
      ) : (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleGoogleAuth}
          disabled={isConnecting}
          className="h-8 px-3 text-xs"
        >
          <Calendar className="w-3 h-3 mr-1" />
          {isConnecting ? '연결중...' : '구글 캘린더 연결'}
        </Button>
      )}
    </div>
  );
};