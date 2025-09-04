import { useCallback } from 'react';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

// Capacitor 타입 확장
declare global {
  interface Window {
    Capacitor?: {
      Plugins?: {
        Haptics?: {
          impact: (options: { style: string }) => Promise<void>;
        };
      };
    };
  }
}

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: HapticType = 'light') => {
    // Capacitor 환경에서는 실제 햅틱 피드백
    if (window.Capacitor?.Plugins?.Haptics) {
      const impact = {
        light: 'LIGHT',
        medium: 'MEDIUM', 
        heavy: 'HEAVY',
        success: 'LIGHT',
        warning: 'MEDIUM',
        error: 'HEAVY'
      };
      
      window.Capacitor.Plugins.Haptics.impact({ 
        style: impact[type] 
      });
    } else {
      // 웹 환경에서는 시각적 피드백으로 대체
      const intensity = {
        light: 50,
        medium: 100,
        heavy: 200,
        success: 50,
        warning: 100,
        error: 200
      };

      // 진동 API가 지원되는 경우
      if (navigator.vibrate) {
        navigator.vibrate(intensity[type]);
      }

      // 시각적 피드백 - 화면 살짝 흔들림 효과
      const body = document.body;
      body.style.animation = `shake-${type} 0.2s ease-in-out`;
      
      setTimeout(() => {
        body.style.animation = '';
      }, 200);
    }
  }, []);

  return { triggerHaptic };
};