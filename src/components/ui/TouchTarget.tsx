import React from 'react';
import { cn } from '@/lib/utils';

interface TouchTargetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  asChild?: boolean;
}

export const TouchTarget: React.FC<TouchTargetProps> = ({
  children,
  size = 'md',
  className,
  asChild = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'min-h-[40px] min-w-[40px]', // 40px minimum for secondary actions
    md: 'min-h-[44px] min-w-[44px]', // 44px Apple HIG recommendation
    lg: 'min-h-[48px] min-w-[48px]'  // 48px for primary actions
  };

  if (asChild) {
    return (
      <div className={cn(sizeClasses[size], 'touch-manipulation', className)} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        sizeClasses[size],
        'flex items-center justify-center',
        'touch-manipulation cursor-pointer',
        'transition-transform duration-100 active:scale-95',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};