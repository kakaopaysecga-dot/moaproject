import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Trophy, Clock } from 'lucide-react';

const menuOptions = [
  '삼겹살', '갈비', '불고기', '비빔밥', '냉면', '김치찌개',
  '된장찌개', '순두부찌개', '부대찌개', '닭갈비', '치킨',
  '피자', '햄버거', '파스타', '돈까스', '회', '초밥',
  '짜장면', '짬뽕', '탕수육', '마라탕', '쌀국수', '팟타이',
  '카레', '라멘', '우동', '소바', '덮밥', '김밥',
  '떡볶이', '순대', '어묵', '호떡', '붕어빵', '타코야키'
];

const colors = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
  'hsl(220, 70%, 50%)',
  'hsl(280, 70%, 50%)',
  'hsl(160, 70%, 50%)',
  'hsl(40, 70%, 50%)',
  'hsl(320, 70%, 50%)',
  'hsl(200, 70%, 50%)',
  'hsl(120, 70%, 50%)'
];

export default function LunchRoulette() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedMenu(null);

    // 랜덤 회전 각도 (최소 5바퀴 + 랜덤)
    const randomIndex = Math.floor(Math.random() * menuOptions.length);
    const baseRotation = 360 * 5; // 5바퀴
    const targetRotation = baseRotation + (360 - (360 / menuOptions.length) * randomIndex);
    
    setRotation(prev => prev + targetRotation);

    // 애니메이션 완료 후 결과 표시
    setTimeout(() => {
      setSelectedMenu(menuOptions[randomIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  const reset = () => {
    setRotation(0);
    setSelectedMenu(null);
    setIsSpinning(false);
  };

  const segmentAngle = 360 / menuOptions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 container-padding spacing-content">
      <div className="text-center spacing-group">
        <div className="spacing-tight">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🍽️ 점심 메뉴 룰렛
          </h1>
          <p className="text-lg text-muted-foreground">
            오늘 점심 뭘 먹을지 고민이세요? 룰렛을 돌려보세요!
          </p>
        </div>

        {/* 룰렛 휠 */}
        <div className="relative flex justify-center items-center spacing-group">
          {/* 포인터 */}
          <div className="absolute top-0 z-20 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-destructive drop-shadow-lg"></div>
          
          {/* 룰렛 휠 */}
          <div className="relative">
            <div 
              ref={wheelRef}
              className="w-80 h-80 md:w-96 md:h-96 rounded-full border-8 border-border shadow-2xl transition-transform duration-3000 ease-out"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                background: `conic-gradient(${menuOptions.map((_, index) => 
                  `${colors[index % colors.length]} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`
                ).join(', ')})`
              }}
            >
              {/* 메뉴 텍스트 */}
              {menuOptions.map((menu, index) => {
                const angle = (index * segmentAngle) + (segmentAngle / 2);
                const radian = (angle * Math.PI) / 180;
                const radius = 120;
                const x = Math.cos(radian) * radius;
                const y = Math.sin(radian) * radius;
                
                return (
                  <div
                    key={menu}
                    className="absolute text-white font-bold text-sm md:text-base drop-shadow-lg"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                  >
                    {menu}
                  </div>
                );
              })}
              
              {/* 중앙 원 */}
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-background border-4 border-border rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-lg">
                <div className="text-2xl">🎯</div>
              </div>
            </div>
          </div>
        </div>

        {/* 결과 표시 */}
        {selectedMenu && (
          <Card className="animate-scale-in border-primary/50 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-6 text-center spacing-tight">
              <Trophy className="w-8 h-8 text-primary mx-auto" />
              <h3 className="text-2xl font-bold text-primary">오늘의 점심 메뉴</h3>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {selectedMenu}
              </div>
              <p className="text-muted-foreground">맛있게 드세요! 🍴</p>
            </CardContent>
          </Card>
        )}

        {/* 컨트롤 버튼 */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={spinWheel} 
            disabled={isSpinning}
            size="lg"
            className="px-8 py-6 text-lg font-semibold animate-pulse hover:animate-none"
          >
            {isSpinning ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                돌리는 중...
              </>
            ) : (
              <>
                🎰 룰렛 돌리기
              </>
            )}
          </Button>
          
          <Button 
            onClick={reset} 
            variant="outline" 
            size="lg"
            className="px-8 py-6"
            disabled={isSpinning}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            초기화
          </Button>
        </div>

        {/* 추가 정보 */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>💡 <strong>총 {menuOptions.length}개</strong>의 메뉴 중에서 랜덤 선택</p>
              <p>🎲 공정한 확률로 메뉴를 추천해드려요</p>
              <p>🍽️ 선택 장애 해결사</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}