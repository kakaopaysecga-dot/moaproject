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
      {/* 배경 글로우 효과 */}
      <div className={`absolute ${sizeClasses[size]} rounded-full bg-gradient-radial from-primary/30 via-primary/10 to-transparent blur-xl animate-pulse pointer-events-none`} style={{ animationDuration: '2s' }}></div>
      
      {/* 포인터 - 12시 방향 고정된 화살표 */}
      <div className="absolute top-0 z-30 flex flex-col items-center">
        <div className="w-0 h-0 border-l-[25px] border-r-[25px] border-t-[50px] border-l-transparent border-r-transparent border-t-destructive drop-shadow-2xl animate-bounce transform translate-y-1" style={{ 
          filter: 'drop-shadow(0 0 10px hsl(var(--destructive)))',
          animationDuration: isSpinning ? '0.3s' : '2s' 
        }}></div>
        <div className="w-2 h-8 bg-destructive rounded-b-full shadow-lg"></div>
      </div>
      
      {/* 룰렛 휠 */}
      <div className="relative">
        {/* 외곽 링 애니메이션 */}
        <div className={`absolute -inset-4 ${sizeClasses[size]} rounded-full border-4 border-gradient-to-r from-primary via-accent to-primary opacity-50 animate-spin pointer-events-none`} style={{ animationDuration: '10s' }}></div>
        <div className={`absolute -inset-2 ${sizeClasses[size]} rounded-full border-2 border-gradient-to-r from-accent via-primary to-accent opacity-30 animate-spin pointer-events-none`} style={{ animationDuration: '8s', animationDirection: 'reverse' }}></div>
        
        <div 
          ref={wheelRef}
          className={`${sizeClasses[size]} rounded-full border-8 border-gradient-to-br from-primary/60 via-accent/40 to-primary/60 shadow-2xl transition-all duration-1000 relative overflow-hidden ${
            isSpinning 
              ? 'transition-transform duration-[4000ms] ease-[cubic-bezier(0.25,0.1,0.1,1)] shadow-[0_0_100px_rgba(var(--primary-rgb),0.8)]' 
              : 'transition-transform duration-500 ease-out hover:scale-105'
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
            boxShadow: isSpinning 
              ? '0 0 100px rgba(var(--primary-rgb), 0.8), inset 0 0 40px rgba(255,255,255,0.2)' 
              : '0 0 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.1)',
            filter: isSpinning ? 'brightness(1.2) saturate(1.3)' : 'brightness(1)'
          }}
        >
          {/* 회전 중 파티클 효과 */}
          {isSpinning && (
            <>
              {[...Array(12)].map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute w-2 h-2 bg-white rounded-full animate-ping"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </>
          )}

          {/* 세그먼트 구분선 */}
          {options.map((_, index) => {
            const angle = index * segmentAngle - 90; // 12시 방향부터 시작하도록 -90도 조정
            return (
              <div
                key={`line-${index}`}
                className="absolute w-1 bg-white/60 origin-bottom shadow-lg"
                style={{
                  height: '50%',
                  left: '50%',
                  bottom: '50%',
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                  transformOrigin: 'bottom center',
                  background: 'linear-gradient(to top, rgba(255,255,255,0.8), rgba(255,255,255,0.3))'
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
                className={`absolute text-white font-bold ${textSizeClasses[size]} drop-shadow-lg transition-all duration-300 ${isSpinning ? 'animate-pulse' : ''}`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) rotate(${angle >= -90 && angle <= 90 ? angle : angle + 180}deg)`,
                  textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 10px rgba(255,255,255,0.3)',
                  maxWidth: '80px',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  filter: isSpinning ? 'brightness(1.3)' : 'brightness(1)'
                }}
              >
                {option.label}
              </div>
            );
          })}
          
          {/* 중앙 원 - 3D 효과 */}
          <div className="absolute top-1/2 left-1/2 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2">
            {/* 외곽 링 */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full shadow-2xl"></div>
            {/* 내부 원 */}
            <div className="absolute inset-2 bg-gradient-to-br from-background via-background/90 to-background/70 rounded-full shadow-inner border-2 border-primary/30 flex items-center justify-center backdrop-blur-sm">
              <div className={`text-3xl transition-all duration-300 ${isSpinning ? 'animate-spin scale-125' : 'animate-pulse'}`}>
                {isSpinning ? '✨' : '🎯'}
              </div>
            </div>
            {/* 글로우 효과 */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/50 to-transparent rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
          </div>

          {/* 장식용 내부 링들 */}
          <div className="absolute top-4 left-4 right-4 bottom-4 rounded-full border-2 border-white/20 shadow-inner"></div>
          <div className="absolute top-8 left-8 right-8 bottom-8 rounded-full border border-white/10"></div>
        </div>

        {/* 승리 효과 */}
        {selectedOption && !isSpinning && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={`confetti-${i}`}
                className="absolute w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};