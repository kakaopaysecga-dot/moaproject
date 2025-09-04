import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Clock, Zap, Settings } from 'lucide-react';

interface RouletteControlsProps {
  onSpin: () => void;
  onReset: () => void;
  onOpenSettings?: () => void;
  isSpinning: boolean;
  spinCount: number;
  disabled?: boolean;
}

export const RouletteControls: React.FC<RouletteControlsProps> = ({
  onSpin,
  onReset,
  onOpenSettings,
  isSpinning,
  spinCount,
  disabled = false
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center items-center">
      <Button 
        onClick={onSpin} 
        disabled={isSpinning || disabled}
        size="lg"
        className="px-8 py-6 text-lg font-semibold relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex items-center">
          {isSpinning ? (
            <>
              <Clock className="w-5 h-5 mr-2 animate-spin" />
              돌리는 중...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              🎰 룰렛 돌리기
            </>
          )}
        </div>
      </Button>
      
      <Button 
        onClick={onReset} 
        variant="outline" 
        size="lg"
        className="px-6 py-6"
        disabled={isSpinning}
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        초기화
      </Button>

      {onOpenSettings && (
        <Button 
          onClick={onOpenSettings} 
          variant="secondary" 
          size="lg"
          className="px-6 py-6"
          disabled={isSpinning}
        >
          <Settings className="w-5 h-5 mr-2" />
          설정
        </Button>
      )}

      {spinCount > 0 && (
        <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-full">
          {spinCount}번째 도전
        </div>
      )}
    </div>
  );
};