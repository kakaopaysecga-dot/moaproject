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
  { id: '1', label: '삼겹살', color: '#FF6B6B' },
  { id: '2', label: '갈비', color: '#4ECDC4' },
  { id: '3', label: '불고기', color: '#45B7D1' },
  { id: '4', label: '비빔밥', color: '#96CEB4' },
  { id: '5', label: '냉면', color: '#FFEAA7' },
  { id: '6', label: '김치찌개', color: '#DDA0DD' },
  { id: '7', label: '된장찌개', color: '#98D8C8' },
  { id: '8', label: '순두부찌개', color: '#F7DC6F' },
  { id: '9', label: '부대찌개', color: '#BB8FCE' },
  { id: '10', label: '닭갈비', color: '#85C1E9' },
  { id: '11', label: '치킨', color: '#F8C471' },
  { id: '12', label: '피자', color: '#82E0AA' }
];

export default function LunchRoulette() {
  const [menuOptions, setMenuOptions] = useLocalStorage<RouletteOption[]>('lunch-roulette-menus', defaultMenuOptions);
  const [showCustomizer, setShowCustomizer] = useState(false);
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
    onSpinComplete: (option) => {
      console.log('Selected:', option.label);
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
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🍽️ 점심 메뉴 룰렛
          </h1>
          <p className="text-lg text-muted-foreground">
            오늘 점심 뭘 먹을지 고민이세요? 룰렛을 돌려보세요!
          </p>
        </div>

        {/* 룰렛 휠 */}
        <div className="spacing-group">
          <RouletteWheel
            options={menuOptions}
            rotation={rotation}
            isSpinning={isSpinning}
            wheelRef={wheelRef}
            size={wheelSize}
          />
        </div>

        {/* 결과 표시 */}
        {selectedOption && (
          <Card className="max-w-md mx-auto border-primary/50 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-lg font-medium text-muted-foreground">
                🎯 선택된 메뉴
              </div>
              <div className="text-3xl font-bold text-foreground">
                {selectedOption.label}
              </div>
              <div className="w-16 h-0.5 bg-primary/30 mx-auto"></div>
              <div className="text-sm text-muted-foreground">
                맛있게 드세요! 🍽️
              </div>
            </CardContent>
          </Card>
        )}

        {/* 컨트롤 버튼들 */}
        <div>
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
        <Card className="max-w-md mx-auto">
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