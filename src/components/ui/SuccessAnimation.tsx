import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessAnimationProps {
  title: string;
  message: string;
  isVisible: boolean;
  onComplete?: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  title,
  message,
  isVisible,
  onComplete
}) => {
  React.useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-background border border-border rounded-lg p-8 max-w-sm mx-4 text-center animate-scale-in">
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <CheckCircle className="h-16 w-16 text-success animate-scale-in" />
            <div className="absolute inset-0 rounded-full bg-success/20 animate-ping"></div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {message}
        </p>
        
        <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-success rounded-full animate-[slide-in-right_2s_ease-out]"></div>
        </div>
      </div>
    </div>
  );
};