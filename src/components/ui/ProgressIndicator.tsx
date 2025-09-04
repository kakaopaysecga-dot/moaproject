import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStep {
  id: string;
  title: string;
  status: 'pending' | 'current' | 'completed' | 'error';
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  steps, 
  className 
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300",
            {
              'bg-muted text-muted-foreground': step.status === 'pending',
              'bg-primary text-primary-foreground animate-pulse': step.status === 'current',
              'bg-success text-success-foreground': step.status === 'completed',
              'bg-destructive text-destructive-foreground': step.status === 'error',
            }
          )}>
            {step.status === 'completed' && <CheckCircle className="h-4 w-4" />}
            {step.status === 'current' && <Clock className="h-4 w-4" />}
            {step.status === 'error' && <AlertCircle className="h-4 w-4" />}
            {step.status === 'pending' && <span className="text-xs">{index + 1}</span>}
          </div>
          
          <div className={cn(
            "text-sm transition-colors",
            {
              'text-muted-foreground': step.status === 'pending',
              'text-foreground font-medium': step.status === 'current',
              'text-success': step.status === 'completed',
              'text-destructive': step.status === 'error',
            }
          )}>
            {step.title}
          </div>
        </div>
      ))}
    </div>
  );
};