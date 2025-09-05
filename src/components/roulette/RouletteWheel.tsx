import React from 'react';
import { RouletteOption } from '@/hooks/useRoulette';

interface RouletteWheelProps {
  options: RouletteOption[];
  rotation: number;
  isSpinning: boolean;
  wheelRef: React.RefObject<HTMLDivElement>;
  size?: 'small' | 'medium' | 'large';
}

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

  if (options.length === 0) {
    return (
      <div className={`${sizeClasses[size]} rounded-full border-4 border-dashed border-muted-foreground/30 flex items-center justify-center`}>
        <p className="text-muted-foreground text-center">메뉴를 추가해주세요</p>
      </div>
    );
  }

  const segmentAngle = 360 / options.length;

  return (
    <div className="relative flex justify-center items-center">
      {/* 고정된 포인터 */}
      <div className="absolute top-2 z-20 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg"></div>
      
      {/* 룰렛 휠 */}
      <div 
        ref={wheelRef}
        className={`${sizeClasses[size]} rounded-full border-4 border-white shadow-xl relative overflow-hidden transition-transform duration-1000 ${
          isSpinning ? 'ease-out' : 'ease-in-out'
        }`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'transform 0.5s ease'
        }}
      >
        {/* 세그먼트들 */}
        {options.map((option, index) => {
          const startAngle = index * segmentAngle;
          const endAngle = (index + 1) * segmentAngle;
          
          // 세그먼트 색상
          const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7DBDD',
            '#AED6F1', '#A9DFBF', '#F9E79F', '#D2B4DE', '#A3E4D7'
          ];
          const color = option.color || colors[index % colors.length];

          return (
            <div
              key={option.id}
              className="absolute inset-0"
              style={{
                background: `conic-gradient(from ${startAngle}deg, ${color} 0deg, ${color} ${segmentAngle}deg, transparent ${segmentAngle}deg)`,
                clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180)}%)`
              }}
            />
          );
        })}

        {/* 메뉴 텍스트 */}
        {options.map((option, index) => {
          const angle = index * segmentAngle + segmentAngle / 2;
          const radian = (angle - 90) * Math.PI / 180; // -90도로 12시 방향 시작
          const radius = size === 'small' ? 80 : size === 'medium' ? 120 : 140;
          const x = Math.cos(radian) * radius * 0.7;
          const y = Math.sin(radian) * radius * 0.7;

          return (
            <div
              key={option.id}
              className={`absolute ${textSizeClasses[size]} font-semibold text-white`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: `translate(-50%, -50%) rotate(${angle - 90}deg)`,
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                maxWidth: '100px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {option.label}
            </div>
          );
        })}

        {/* 중앙 원 */}
        <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white border-2 border-gray-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-md">
          <span className="text-lg">{isSpinning ? '🎲' : '🎯'}</span>
        </div>
      </div>
    </div>
  );
};