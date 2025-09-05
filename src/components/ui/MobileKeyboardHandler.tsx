import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MobileKeyboardHandlerProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileKeyboardHandler: React.FC<MobileKeyboardHandlerProps> = ({
  children,
  className
}) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialViewportHeight = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    initialViewportHeight.current = window.visualViewport?.height || window.innerHeight;

    const handleViewportChange = () => {
      if (!window.visualViewport) return;
      
      const currentHeight = window.visualViewport.height;
      const heightDifference = initialViewportHeight.current - currentHeight;
      
      // 키보드가 열렸다고 판단하는 임계값 (150px)
      const isOpen = heightDifference > 150;
      
      setIsKeyboardOpen(isOpen);
      setKeyboardHeight(isOpen ? heightDifference : 0);
    };

    // Visual Viewport API 지원 확인
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
      };
    }

    // Fallback for older browsers
    const handleResize = () => {
      const heightDifference = initialViewportHeight.current - window.innerHeight;
      const isOpen = heightDifference > 150;
      
      setIsKeyboardOpen(isOpen);
      setKeyboardHeight(isOpen ? heightDifference : 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'transition-all duration-300 ease-in-out',
        isKeyboardOpen && 'pb-safe-bottom',
        className
      )}
      style={{
        paddingBottom: isKeyboardOpen ? `${Math.max(keyboardHeight - 20, 0)}px` : undefined
      }}
    >
      {children}
    </div>
  );
};