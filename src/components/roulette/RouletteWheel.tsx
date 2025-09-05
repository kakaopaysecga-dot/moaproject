import React from 'react';
import { RouletteOption } from '@/hooks/useRoulette';

interface RouletteWheelProps {
  options: RouletteOption[];
  rotation: number;
  isSpinning: boolean;
  wheelRef: React.RefObject<HTMLDivElement>;
  size?: 'small' | 'medium' | 'large';
}

const defaultColors = [
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

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  options,
  rotation,
  isSpinning,
  wheelRef,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'w-64 h-64',
    medium: 'w-80 h-80 md:w-96 md:h-96',
    large: 'w-96 h-96 md:w-[28rem] md:h-[28rem]'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm md:text-base',
    large: 'text-base md:text-lg'
  };

  const radiusValues = {
    small: 80,
    medium: 120,
    large: 140
  };

  const segmentAngle = 360 / Math.max(options.length, 1);
  const radius = radiusValues[size];

  if (options.length === 0) {
    return (
      <div className={`${sizeClasses[size]} rounded-full border-8 border-dashed border-muted-foreground/30 flex items-center justify-center`}>
        <p className="text-muted-foreground text-center">메뉴를 추가해주세요</p>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center">
      {/* 포인터 - 12시 방향 고정된 화살표 */}
      <div className="absolute top-0 z-20 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-destructive drop-shadow-lg transform translate-y-1 animate-pulse"></div>
      
      {/* 룰렛 휠 */}
      <div className="relative">
        <div 
          ref={wheelRef}
          className={`${sizeClasses[size]} rounded-full border-8 border-gradient-to-br from-border to-primary/20 shadow-2xl transition-all duration-1000 relative overflow-hidden ${
            isSpinning 
              ? 'transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]' 
              : 'transition-transform duration-500 ease-out'
          }`}
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            background: `conic-gradient(${options.map((option, index) => {
              const color = option.color || defaultColors[index % defaultColors.length];
              // 12시 방향부터 시작하도록 각도 조정
              const startAngle = (index * segmentAngle - 90) % 360;
              const endAngle = ((index + 1) * segmentAngle - 90) % 360;
              return `${color} ${startAngle}deg ${endAngle}deg`;
            }).join(', ')})`,
            boxShadow: '0 0 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.1)'
          }}
        >
          {/* 세그먼트 구분선 */}
          {options.map((_, index) => {
            const angle = index * segmentAngle - 90; // 12시 방향부터 시작하도록 -90도 조정
            return (
              <div
                key={`line-${index}`}
                className="absolute w-0.5 bg-background/40 origin-bottom"
                style={{
                  height: '50%',
                  left: '50%',
                  bottom: '50%',
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                  transformOrigin: 'bottom center'
                }}
              />
            );
          })}

          {/* 메뉴 텍스트 */}
          {options.map((option, index) => {
            // 12시 방향부터 시작하도록 각도 조정
            const angle = (index * segmentAngle) + (segmentAngle / 2) - 90;
            const radian = (angle * Math.PI) / 180;
            const textRadius = radius * 0.7; // 텍스트를 원의 중심에서 70% 지점에 배치
            const x = Math.cos(radian) * textRadius;
            const y = Math.sin(radian) * textRadius;
            
            return (
              <div
                key={option.id}
                className={`absolute text-white font-bold ${textSizeClasses[size]} drop-shadow-lg transition-all duration-300`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) rotate(${angle >= -90 && angle <= 90 ? angle : angle + 180}deg)`,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  maxWidth: '80px',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}
              >
                {option.label}
              </div>
            );
          })}
          
          {/* 중앙 원 */}
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-background to-background/80 border-4 border-primary/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-lg backdrop-blur-sm">
            <div className={`text-2xl ${isSpinning ? 'animate-spin' : ''}`}>
              {isSpinning ? '🌟' : '🎯'}
            </div>
          </div>

          {/* 장식용 내부 링 */}
          <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full border-2 border-white/10"></div>
        </div>

        {/* 장식용 외곽 링 */}
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-4 border-primary/20 pointer-events-none`}></div>
        
        {/* 글로우 효과 */}
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full bg-gradient-radial from-primary/10 to-transparent pointer-events-none`}></div>
      </div>
    </div>
  );
};