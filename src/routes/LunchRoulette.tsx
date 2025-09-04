import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { useRoulette, RouletteOption } from '@/hooks/useRoulette';
import { RouletteWheel } from '@/components/roulette/RouletteWheel';
import { RouletteControls } from '@/components/roulette/RouletteControls';
import { MenuCustomizer } from '@/components/roulette/MenuCustomizer';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const defaultMenuOptions: RouletteOption[] = [
  { id: '1', label: '삼겹살', color: 'hsl(var(--primary))' },
  { id: '2', label: '갈비', color: 'hsl(var(--accent))' },
  { id: '3', label: '불고기', color: 'hsl(var(--success))' },
  { id: '4', label: '비빔밥', color: 'hsl(var(--warning))' },
  { id: '5', label: '냉면', color: 'hsl(var(--destructive))' },
  { id: '6', label: '김치찌개', color: 'hsl(220, 70%, 50%)' },
  { id: '7', label: '된장찌개', color: 'hsl(280, 70%, 50%)' },
  { id: '8', label: '순두부찌개', color: 'hsl(160, 70%, 50%)' },
  { id: '9', label: '부대찌개', color: 'hsl(40, 70%, 50%)' },
  { id: '10', label: '닭갈비', color: 'hsl(320, 70%, 50%)' },
  { id: '11', label: '치킨', color: 'hsl(200, 70%, 50%)' },
  { id: '12', label: '피자', color: 'hsl(120, 70%, 50%)' },
  { id: '13', label: '햄버거', color: 'hsl(60, 70%, 50%)' },
  { id: '14', label: '파스타', color: 'hsl(300, 70%, 50%)' },
  { id: '15', label: '돈까스', color: 'hsl(180, 70%, 50%)' },
  { id: '16', label: '회', color: 'hsl(240, 70%, 50%)' },
  { id: '17', label: '초밥', color: 'hsl(20, 70%, 50%)' },
  { id: '18', label: '짜장면', color: 'hsl(340, 70%, 50%)' },
  { id: '19', label: '짬뽕', color: 'hsl(100, 70%, 50%)' },
  { id: '20', label: '탕수육', color: 'hsl(260, 70%, 50%)' },
  { id: '21', label: '마라탕', color: 'hsl(80, 70%, 50%)' },
  { id: '22', label: '쌀국수', color: 'hsl(140, 70%, 50%)' },
  { id: '23', label: '팟타이', color: 'hsl(190, 70%, 50%)' },
  { id: '24', label: '카레', color: 'hsl(350, 70%, 50%)' }
];

export default function LunchRoulette() {
  const [menuOptions, setMenuOptions] = useLocalStorage<RouletteOption[]>('lunch-roulette-menus', defaultMenuOptions);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [wheelSize, setWheelSize] = useState<'small' | 'medium' | 'large'>('medium');

  const {
    isSpinning,
    selectedOption,
    rotation,
    spinCount,
    wheelRef,
    spin,
    reset
  } = useRoulette({
    options: menuOptions,
    onSpinComplete: () => {
      setShowResult(true);
      // 결과 표시 후 5초 뒤에 자동으로 닫기
      setTimeout(() => setShowResult(false), 5000);
    }
  });

  // 화면 크기에 따른 휠 사이즈 자동 조정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setWheelSize('small');
      } else if (window.innerWidth < 1024) {
        setWheelSize('medium');
      } else {
        setWheelSize('large');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuOptionsChange = (newOptions: RouletteOption[]) => {
    setMenuOptions(newOptions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 container-padding spacing-content">
      <div className="text-center spacing-group">
        {/* 헤더 */}
        <div className="spacing-tight">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-fade-in">
            🍽️ 점심 메뉴 룰렛
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
            오늘 점심 뭘 먹을지 고민이세요? 룰렛을 돌려보세요!
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
            <Star className="w-4 h-4 text-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Star className="w-4 h-4 text-yellow-500 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* 룰렛 휠 */}
        <div className="spacing-group animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <RouletteWheel
            options={menuOptions}
            rotation={rotation}
            isSpinning={isSpinning}
            wheelRef={wheelRef}
            size={wheelSize}
          />
        </div>

        {/* 컨트롤 버튼들 */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <RouletteControls
            onSpin={spin}
            onReset={reset}
            onOpenSettings={() => setShowCustomizer(true)}
            isSpinning={isSpinning}
            spinCount={spinCount}
            disabled={menuOptions.length === 0}
          />
        </div>

        {/* 통계 정보 */}
        <Card className="max-w-md mx-auto animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex justify-between items-center">
                <span>💡 등록된 메뉴</span>
                <span className="font-semibold">{menuOptions.length}개</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🎲 도전 횟수</span>
                <span className="font-semibold">{spinCount}번</span>
              </div>
              <div className="text-xs text-muted-foreground/70 mt-3">
                🍽️ 공정한 확률로 메뉴를 추천해드려요
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 결과 모달 */}
        <Dialog open={showResult} onOpenChange={setShowResult}>
          <DialogContent className="max-w-sm mx-auto border-0 bg-card/95 backdrop-blur-sm">
            <div className="text-center py-8 space-y-6">
              <div className="space-y-3">
                <div className="text-lg font-medium text-muted-foreground">
                  오늘의 점심 메뉴
                </div>
                <div className="text-4xl font-bold text-foreground animate-scale-in">
                  {selectedOption?.label}
                </div>
              </div>
              
              <div className="w-16 h-0.5 bg-primary/30 mx-auto animate-fade-in"></div>
              
              <div className="text-sm text-muted-foreground">
                맛있게 드세요!
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 메뉴 커스터마이저 모달 */}
        <Dialog open={showCustomizer} onOpenChange={setShowCustomizer}>
          <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <MenuCustomizer
              options={menuOptions}
              onOptionsChange={handleMenuOptionsChange}
              onClose={() => setShowCustomizer(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}