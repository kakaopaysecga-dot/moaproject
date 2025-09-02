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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
      <div className="bg-background border border-border rounded-2xl p-12 max-w-md w-full mx-4 text-center animate-scale-in shadow-2xl">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <CheckCircle className="h-24 w-24 text-success animate-scale-in" />
            <div className="absolute inset-0 rounded-full bg-success/20 animate-ping"></div>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {title}
        </h3>
        
        <p className="text-base text-muted-foreground animate-fade-in mb-6" style={{ animationDelay: '0.4s' }}>
          {message}
        </p>
        
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-success rounded-full animate-[slide-in-right_2.5s_ease-out]"></div>
        </div>
      </div>
    </div>
  );
};