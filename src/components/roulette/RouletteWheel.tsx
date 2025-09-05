import React from 'react';
import { RouletteOption } from '@/hooks/useRoulette';

interface RouletteWheelProps {
  options: RouletteOption[];
  rotation: number;
  isSpinning: boolean;
  wheelRef: React.RefObject<HTMLDivElement>;
  size?: 'small' | 'medium' | 'large';
  selectedOption?: RouletteOption | null;
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
  size = 'medium',
  selectedOption
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
      {/* 포인터 - 12시 방향 고정된 심플한 화살표 */}
      <div className="absolute top-0 z-30 flex flex-col items-center">
        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[35px] border-l-transparent border-r-transparent border-t-destructive drop-shadow-lg"></div>
      </div>
      
      {/* 룰렛 휠 */}
      <div className="relative">
        <div 
          ref={wheelRef}
          className={`${sizeClasses[size]} rounded-full border-4 border-white shadow-xl transition-all duration-1000 relative overflow-hidden ${
            isSpinning 
              ? 'transition-transform duration-[4000ms] ease-[cubic-bezier(0.25,0.1,0.1,1)]' 
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
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
          }}
        >
          {/* 세그먼트 구분선 */}
          {options.map((_, index) => {
            const angle = index * segmentAngle - 90; // 12시 방향부터 시작하도록 -90도 조정
            return (
              <div
                key={`line-${index}`}
                className="absolute w-0.5 bg-white/70 origin-bottom"
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

          {/* 메뉴 텍스트 - 칸에 맞게 정렬 */}
          {options.map((option, index) => {
            // 12시 방향부터 시작하도록 각도 조정
            const angle = (index * segmentAngle) + (segmentAngle / 2) - 90;
            const radian = (angle * Math.PI) / 180;
            const textRadius = radius * 0.65; // 텍스트를 원의 중심에서 65% 지점에 배치
            const x = Math.cos(radian) * textRadius;
            const y = Math.sin(radian) * textRadius;
            
            // 텍스트 회전 각도 계산 - 항상 읽기 쉽게
            let textRotation = angle;
            if (angle > 90 || angle < -90) {
              textRotation = angle + 180;
            }
            
            return (
              <div
                key={option.id}
                className={`absolute text-white font-semibold ${textSizeClasses[size]} flex items-center justify-center text-center`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) rotate(${textRotation}deg)`,
                  textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                  width: `${Math.min(80, (segmentAngle / 360) * 200)}px`,
                  height: 'auto',
                  lineHeight: '1.2',
                  wordBreak: 'keep-all',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {option.label}
              </div>
            );
          })}
          
          {/* 중앙 원 - 심플한 디자인 */}
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white border-4 border-gray-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-lg">
            <div className={`text-2xl transition-all duration-300 ${isSpinning ? 'animate-spin' : ''}`}>
              {isSpinning ? '🎲' : '🎯'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};