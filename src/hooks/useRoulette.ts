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
    
    // 완전히 랜덤하게 최종 각도 결정
    const randomFinalAngle = Math.random() * 360;
    const totalRotation = spins * 360 + randomFinalAngle;
    
    setRotation(prev => prev + totalRotation);
    setSpinCount(prev => prev + 1);

    // 4초 후 결과 처리 - 포인터가 실제로 가리키는 세그먼트 계산
    setTimeout(() => {
      // 최종 회전 각도에서 정규화
      const finalAngle = (rotation + totalRotation) % 360;
      
      // 포인터는 12시 방향(0도)에 고정되어 있음
      // 휠이 시계방향으로 회전했으므로, 포인터가 가리키는 세그먼트를 계산
      // 첫 번째 세그먼트는 12시 방향부터 시작
      const pointerAngle = (360 - finalAngle) % 360;
      
      // 어느 세그먼트를 가리키는지 계산
      const selectedIndex = Math.floor(pointerAngle / segmentAngle) % options.length;
      
      const selectedOpt = options[selectedIndex];
      setSelectedOption(selectedOpt);
      setIsSpinning(false);
      onSpinComplete?.(selectedOpt);
    }, 4000);
  }, [isSpinning, options, onSpinComplete, rotation]);

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