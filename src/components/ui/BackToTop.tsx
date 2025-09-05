import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  threshold?: number;
  className?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({ 
  threshold = 300,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { triggerHaptic } = useHapticFeedback();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    triggerHaptic('light');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={cn(
        'fixed bottom-24 right-4 z-40 h-12 w-12 rounded-full',
        'shadow-lg bg-primary hover:bg-primary/90',
        'transition-all duration-300 animate-slide-in-bottom',
        'md:bottom-8 md:right-8',
        className
      )}
      aria-label="맨 위로 스크롤"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};