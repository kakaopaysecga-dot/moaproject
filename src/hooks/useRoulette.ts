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

    // 스크롤 위치 고정하여 스핀 중 페이지 이동 방지
    const currentScrollY = window.scrollY;
    
    setIsSpinning(true);
    setSelectedOption(null);

    // 극적인 회전 설정
    const minSpins = 5; // 최소 회전 수 증가
    const maxSpins = 8; // 최대 회전 수 증가
    const randomSpins = minSpins + Math.random() * (maxSpins - minSpins);
    
    // 더 정교한 랜덤 각도 계산
    const segmentAngle = 360 / options.length;
    const targetSegment = Math.floor(Math.random() * options.length);
    const segmentCenter = (targetSegment * segmentAngle) + (segmentAngle / 2);
    const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.8; // 세그먼트 내에서 랜덤 위치
    const finalAngle = segmentCenter + randomOffset;
    
    const totalRotation = randomSpins * 360 + finalAngle;
    const finalRotation = rotation + totalRotation;

    setRotation(finalRotation);
    setSpinCount(prev => prev + 1);

    // 애니메이션 완료 후 결과 계산
    const duration = 3000 + Math.random() * 1000; // 3-4초 지속시간
    
    setTimeout(() => {
      // 최종 회전 각도에서 포인터(12시 방향)가 가리키는 세그먼트 계산
      const normalizedAngle = (360 - (finalRotation % 360) + 360) % 360; // 시계 반대방향으로 회전하므로 반전
      const segmentAngle = 360 / options.length;
      
      // 포인터가 12시 방향에 있으므로 어떤 세그먼트를 가리키는지 계산
      // 각 세그먼트의 중심점을 기준으로 계산
      let selectedIndex = Math.floor((normalizedAngle + segmentAngle / 2) / segmentAngle) % options.length;
      
      // 인덱스가 음수가 되지 않도록 보정
      if (selectedIndex < 0) {
        selectedIndex = options.length + selectedIndex;
      }
      
      const selectedOpt = options[selectedIndex];
      setSelectedOption(selectedOpt);
      setIsSpinning(false);
      
      // 스크롤 위치 복원
      window.scrollTo(0, currentScrollY);
      
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