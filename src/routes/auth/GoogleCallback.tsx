import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleCalendarService } from '@/services/googleCalendarService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          throw new Error('구글 인증이 취소되었습니다.');
        }

        if (!code) {
          throw new Error('인증 코드가 없습니다.');
        }

        // Exchange code for tokens
        await GoogleCalendarService.exchangeCodeForTokens(code);

        toast({
          title: "연결 성공",
          description: "구글 캘린더가 성공적으로 연결되었습니다.",
        });

        // Clear callback flag and redirect
        sessionStorage.removeItem('google_auth_callback');
        navigate('/', { replace: true });

      } catch (error) {
        console.error('Google callback error:', error);
        toast({
          title: "연결 실패",
          description: error instanceof Error ? error.message : "구글 캘린더 연결에 실패했습니다.",
          variant: "destructive",
        });
        navigate('/', { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <div>
          <h2 className="text-lg font-semibold">구글 캘린더 연결중...</h2>
          <p className="text-sm text-muted-foreground">잠시만 기다려주세요.</p>
        </div>
      </div>
    </div>
  );
}