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

    // 랜덤하게 선택할 옵션 인덱스
    const randomIndex = Math.floor(Math.random() * options.length);
    const selectedOpt = options[randomIndex];

    // 애니메이션 설정
    const segmentAngle = 360 / options.length;
    const minSpins = 5; // 최소 회전 수
    const maxSpins = 8; // 최대 회전 수
    const randomSpins = minSpins + Math.random() * (maxSpins - minSpins);
    
    // 목표 각도 계산 (선택된 옵션이 포인터(12시 방향)에 오도록)
    const targetAngle = 360 - (segmentAngle * randomIndex + segmentAngle / 2);
    const totalRotation = randomSpins * 360 + targetAngle;

    setRotation(prev => prev + totalRotation);
    setSpinCount(prev => prev + 1);

    // 애니메이션 완료 후 결과 처리
    const duration = 3000 + Math.random() * 2000; // 3-5초 랜덤 지속시간
    setTimeout(() => {
      setSelectedOption(selectedOpt);
      setIsSpinning(false);
      onSpinComplete?.(selectedOpt);
    }, duration);
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