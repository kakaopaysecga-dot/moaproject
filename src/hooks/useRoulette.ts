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

    // 완전히 랜덤한 회전 설정
    const minSpins = 3; // 최소 회전 수
    const maxSpins = 6; // 최대 회전 수
    const randomSpins = minSpins + Math.random() * (maxSpins - minSpins);
    const randomAngle = Math.random() * 360; // 0-360도 사이의 랜덤 각도
    
    const totalRotation = randomSpins * 360 + randomAngle;
    const finalRotation = rotation + totalRotation;

    setRotation(finalRotation);
    setSpinCount(prev => prev + 1);

    // 애니메이션 완료 후 결과 계산
    const duration = 3000 + Math.random() * 2000; // 3-5초 랜덤 지속시간
    setTimeout(() => {
      // 최종 회전 각도에서 포인터(12시 방향)가 가리키는 세그먼트 계산
      const normalizedAngle = (finalRotation % 360 + 360) % 360; // 항상 양수로 만들기
      const segmentAngle = 360 / options.length;
      
      // 포인터는 12시 방향(0도)에 있음
      // 첫 번째 세그먼트는 0도에서 시작하므로 직접 계산
      const selectedIndex = Math.floor(normalizedAngle / segmentAngle) % options.length;
      
      const selectedOpt = options[selectedIndex];
      setSelectedOption(selectedOpt);
      setIsSpinning(false);
      onSpinComplete?.(selectedOpt);
    }, duration);
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