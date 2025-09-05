import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Thermometer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRequestsStore } from '@/store/requestsStore';
import { useToast } from '@/hooks/use-toast';

export const TemperatureControl: React.FC = () => {
  const { 
    createTempRequest, 
    isLoading, 
    coldCooldown, 
    hotCooldown, 
    updateCooldowns,
    error
  } = useRequestsStore();
  const { toast } = useToast();

  useEffect(() => {
    updateCooldowns();
  }, [updateCooldowns]);

  const handleTempRequest = async (type: 'cold' | 'hot') => {
    try {
      await createTempRequest(type);
      toast({
        title: '온도 조절 요청 완료',
        description: `${type === 'cold' ? '추위' : '더위'} 신고가 접수되었습니다.`,
      });
    } catch (error) {
      // 에러는 store에서 처리됨
    }
  };

  const formatCooldownTime = (minutes: number): string => {
    if (minutes <= 0) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}시간 ${mins}분 후 재신청 가능`;
    }
    return `${mins}분 후 재신청 가능`;
  };

  return (
    <Card className="shadow-md border-0">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Thermometer className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">온도 조절</h3>
            <p className="text-sm text-muted-foreground">실내 온도가 불편하면 신고해주세요</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTempRequest('cold')}
            disabled={isLoading || coldCooldown > 0}
            className="flex-1 h-10"
          >
            <span className="mr-1">🥶</span>
            추워요
            {coldCooldown > 0 && (
              <span className="text-xs ml-1 text-muted-foreground block">
                ({coldCooldown}분)
              </span>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTempRequest('hot')}
            disabled={isLoading || hotCooldown > 0}
            className="flex-1 h-10"
          >
            <span className="mr-1">🥵</span>
            더워요
            {hotCooldown > 0 && (
              <span className="text-xs ml-1 text-muted-foreground block">
                ({hotCooldown}분)
              </span>
            )}
          </Button>
        </div>

        {(coldCooldown > 0 || hotCooldown > 0) && (
          <div className="mt-3 text-xs text-muted-foreground">
            {coldCooldown > 0 && <p>추위 신고: {formatCooldownTime(coldCooldown)}</p>}
            {hotCooldown > 0 && <p>더위 신고: {formatCooldownTime(hotCooldown)}</p>}
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <Link to="/requests/environment">
            <Button variant="ghost" size="sm" className="w-full text-sm">
              사무환경 개선 요청하기 →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};