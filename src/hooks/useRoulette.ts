import { useState, useCallback, useRef } from 'react';

export interface RouletteOption {
  id: string;
  label: string;
  color?: string;
}

export interface UseRouletteProps {
  options: RouletteOption[];
  onSpinComplete?: (selectedOption: RouletteOption) => void;
}

export const useRoulette = ({ options, onSpinComplete }: UseRouletteProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<RouletteOption | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = useCallback(() => {
    if (isSpinning || options.length === 0) return;

    setIsSpinning(true);
    setSelectedOption(null);

    // 회전 계산
    const segmentAngle = 360 / options.length;
    const minSpins = 5;
    const maxSpins = 8;
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    
    // 랜덤하게 선택될 세그먼트 결정
    const targetIndex = Math.floor(Math.random() * options.length);
    const targetAngle = targetIndex * segmentAngle + segmentAngle / 2;
    
    // 포인터가 12시 방향에 고정되어 있으므로, 해당 세그먼트가 12시 방향에 오도록 회전
    const finalRotation = spins * 360 + (360 - targetAngle);
    
    setRotation(prev => prev + finalRotation);
    setSpinCount(prev => prev + 1);

    // 4초 후 결과 처리
    setTimeout(() => {
      const selectedOpt = options[targetIndex];
      setSelectedOption(selectedOpt);
      setIsSpinning(false);
      onSpinComplete?.(selectedOpt);
    }, 4000);
  }, [isSpinning, options, onSpinComplete]);

  const reset = useCallback(() => {
    setRotation(0);
    setSelectedOption(null);
    setIsSpinning(false);
    setSpinCount(0);
  }, []);

  return {
    isSpinning,
    selectedOption,
    rotation,
    spinCount,
    wheelRef,
    spin,
    reset
  };
};