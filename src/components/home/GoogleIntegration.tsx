import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, LinkIcon, Unlink, Settings, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleCalendarService } from '@/services/googleCalendarService';

export const GoogleIntegration: React.FC = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    setIsConnected(GoogleCalendarService.isConnected());
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      if (GoogleCalendarService.getDemoMode()) {
        // 시연용: 가짜 구글 인증 시뮬레이션
        toast({
          title: "구글 인증 중...",
          description: "구글 계정에 연결하는 중입니다.",
        });

        // 가짜 코드로 토큰 교환 시뮬레이션
        await GoogleCalendarService.exchangeCodeForTokens('demo_auth_code');
        
        setIsConnected(true);
        toast({
          title: "연결 완료!",
          description: "구글 캘린더가 성공적으로 연결되었습니다.",
        });
      } else {
        // 실제 구글 OAuth 플로우
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

        sessionStorage.setItem('google_auth_callback', 'true');
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: "연결 실패",
        description: "구글 연동에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    GoogleCalendarService.disconnect();
    setIsConnected(false);
    toast({
      title: "연결 해제됨",
      description: "구글 계정 연결이 해제되었습니다.",
    });
  };

  return (
    <Card className="p-4 border-2 transition-all duration-200 hover:shadow-md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">구글 연동</h3>
                {GoogleCalendarService.getDemoMode() && (
                  <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
                    <Play className="w-3 h-3 mr-1" />
                    시연용
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">캘린더 및 계정 연동</p>
            </div>
          </div>
          
          {isConnected && (
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              연결됨
            </Badge>
          )}
        </div>

        {/* Connection Status */}
        <div className="space-y-3">
          {isConnected ? (
            <>
              <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-success font-medium">
                    {GoogleCalendarService.getDemoMode() ? '구글 계정에 연결됨 (시연)' : '구글 계정에 연결됨'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  예약 시 자동으로 구글 캘린더에 일정이 추가됩니다.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  className="flex-1"
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  연결 해제
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-3"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 rounded-lg bg-muted/30 border border-dashed border-muted-foreground/30">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-muted-foreground/10 flex items-center justify-center">
                    <LinkIcon className="w-6 h-6 text-muted-foreground/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">연결되지 않음</p>
                    <p className="text-xs text-muted-foreground">
                      {GoogleCalendarService.getDemoMode() 
                        ? '시연용 구글 계정을 연결하여 기능을 체험하세요' 
                        : '구글 계정을 연결하여 캘린더와 동기화하세요'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full"
                size="sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {isConnecting ? '연결중...' : (GoogleCalendarService.getDemoMode() ? '시연용 구글 연결' : '구글 계정 연결')}
              </Button>
            </>
          )}
        </div>

        {/* Benefits */}
        {!isConnected && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">연결 후 이용 가능:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary"></div>
                자동 캘린더 일정 생성
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary"></div>
                예약 알림 받기
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-primary"></div>
                일정 중복 방지
              </li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};