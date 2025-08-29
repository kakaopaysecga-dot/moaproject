import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, CheckCircle, LinkIcon, Unlink, Settings, ExternalLink, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleCalendarService } from '@/services/googleCalendarService';

export const GoogleIntegration: React.FC = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  useEffect(() => {
    setIsConnected(GoogleCalendarService.isConnected());
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      console.log('Starting Google OAuth flow...');
      
      // 구글 OAuth 설정
      const clientId = '759409896984-a43f1m1d98aht31rmcmogud1ev7lvk6l.apps.googleusercontent.com';
      const currentUrl = window.location.origin;
      const redirectUri = `${currentUrl}/auth/google/callback`;
      const scope = 'https://www.googleapis.com/auth/calendar.events';
      
      console.log('OAuth parameters:', {
        clientId,
        redirectUri,
        scope,
        currentUrl
      });
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${Date.now()}`;

      console.log('Redirecting to:', authUrl);
      sessionStorage.setItem('google_auth_callback', 'true');
      window.location.href = authUrl;
    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: "연결 실패",
        description: "구글 연동에 실패했습니다. 콘솔을 확인해주세요.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const enableDemoMode = () => {
    // 시연용 모드 활성화
    localStorage.setItem('demo_google_connected', 'true');
    setIsConnected(true);
    toast({
      title: "시연 모드 활성화",
      description: "시연용 구글 연동이 활성화되었습니다.",
    });
  };

  const handleDisconnect = () => {
    GoogleCalendarService.disconnect();
    localStorage.removeItem('demo_google_connected');
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
              <h3 className="font-semibold text-foreground">구글 연동</h3>
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

        {/* OAuth 설정 경고 */}
        {!isConnected && (
          <Alert className="border-warning/20 bg-warning/5">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-sm">
              구글 연동이 거부되었나요? 실제 OAuth 설정이 필요하거나 아래 시연 모드를 사용하세요.
            </AlertDescription>
          </Alert>
        )}

        {/* Connection Status */}
        <div className="space-y-3">
          {isConnected ? (
            <>
              <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-success font-medium">구글 계정에 연결됨</span>
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
                      구글 계정을 연결하여 캘린더와 동기화하세요
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full"
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {isConnecting ? '연결중...' : '구글 계정 연결'}
                </Button>
                
                <Button
                  onClick={enableDemoMode}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  🎭 시연 모드로 체험하기
                </Button>
                
                <Button
                  onClick={() => setShowSetupGuide(!showSetupGuide)}
                  variant="ghost"
                  className="w-full"
                  size="sm"
                >
                  <Info className="w-4 h-4 mr-2" />
                  OAuth 설정 가이드
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Setup Guide */}
        {showSetupGuide && (
          <Alert className="border-info/20 bg-info/5">
            <Info className="h-4 w-4 text-info" />
            <AlertDescription className="text-sm space-y-3">
              <div className="font-semibold">Google OAuth 설정 단계별 가이드:</div>
              
              <div className="space-y-2">
                <div className="font-medium">1. Google Cloud Console 설정</div>
                <ol className="list-decimal list-inside space-y-1 text-xs ml-2">
                  <li>Google Cloud Console에서 새 프로젝트 생성 또는 기존 프로젝트 선택</li>
                  <li>Google Calendar API 활성화 (API 및 서비스 → 라이브러리)</li>
                  <li>OAuth 동의 화면 설정 (외부 사용자 타입으로 설정)</li>
                  <li>테스트 사용자에 본인 이메일 추가</li>
                </ol>
              </div>

              <div className="space-y-2">
                <div className="font-medium">2. OAuth 클라이언트 ID 생성</div>
                <ol className="list-decimal list-inside space-y-1 text-xs ml-2">
                  <li>사용자 인증 정보 → OAuth 2.0 클라이언트 ID 생성</li>
                  <li>애플리케이션 유형: 웹 애플리케이션</li>
                  <li>승인된 JavaScript 출처: <code className="bg-muted px-1 rounded">{window.location.origin}</code></li>
                  <li>승인된 리디렉션 URI: <code className="bg-muted px-1 rounded">{window.location.origin}/auth/google/callback</code></li>
                </ol>
              </div>

              <div className="space-y-2">
                <div className="font-medium">3. 필수 범위(Scope) 설정</div>
                <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                  <li>../auth/userinfo.email</li>
                  <li>../auth/userinfo.profile</li>
                  <li>openid</li>
                  <li>https://www.googleapis.com/auth/calendar.events</li>
                </ul>
              </div>

              <Button
                variant="link"
                className="p-0 h-auto text-xs mt-2"
                onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Google Cloud Console 열기
              </Button>
            </AlertDescription>
          </Alert>
        )}

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