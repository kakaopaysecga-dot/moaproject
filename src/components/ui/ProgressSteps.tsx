import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  className
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            {/* Step circle */}
            <div className={cn(
              "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold border-2 transition-all duration-300",
              index < currentStep
                ? "bg-success border-success text-white"
                : index === currentStep
                ? "bg-primary border-primary text-primary-foreground animate-glow-pulse"
                : "bg-muted border-muted-foreground/30 text-muted-foreground"
            )}>
              {index < currentStep ? (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            
            {/* Step label */}
            <div className={cn(
              "mt-2 text-xs md:text-sm text-center font-medium",
              index <= currentStep ? "text-foreground" : "text-muted-foreground"
            )}>
              {step}
            </div>
            
            {/* Progress line */}
            {index < steps.length - 1 && (
              <div className="absolute top-4 md:top-5 left-1/2 w-full h-0.5 -z-10">
                <div className={cn(
                  "h-full transition-all duration-500",
                  index < currentStep ? "bg-success" : "bg-muted"
                )} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2 md:h-3 mb-2">
        <div 
          className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
        />
      </div>
      
      {/* Progress text */}
      <div className="text-xs md:text-sm text-muted-foreground text-center">
        {currentStep + 1} / {steps.length} 단계 완료
      </div>
    </div>
  );
};