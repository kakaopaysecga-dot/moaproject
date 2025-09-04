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
      {/* 포인터 */}
      <div className="absolute top-0 z-20 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-destructive drop-shadow-lg animate-pulse"></div>
      
      {/* 룰렛 휠 */}
      <div className="relative">
        <div 
          ref={wheelRef}
          className={`${sizeClasses[size]} rounded-full border-8 border-border shadow-2xl transition-all duration-1000 ${
            isSpinning 
              ? 'transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]' 
              : 'transition-transform duration-500 ease-out'
          }`}
          style={{ 
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(${options.map((option, index) => {
              const color = option.color || defaultColors[index % defaultColors.length];
              return `${color} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`;
            }).join(', ')})`
          }}
        >
          {/* 메뉴 텍스트 */}
          {options.map((option, index) => {
            const angle = (index * segmentAngle) + (segmentAngle / 2);
            const radian = (angle * Math.PI) / 180;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            return (
              <div
                key={option.id}
                className={`absolute text-white font-bold ${textSizeClasses[size]} drop-shadow-lg transition-all duration-300 hover:scale-110`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
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
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-background border-4 border-border rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-lg">
            <div className={`text-2xl ${isSpinning ? 'animate-spin' : ''}`}>
              {isSpinning ? '🌟' : '🎯'}
            </div>
          </div>
        </div>

        {/* 장식용 외곽 링 */}
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-4 border-primary/20 animate-pulse pointer-events-none`}></div>
      </div>
    </div>
  );
};