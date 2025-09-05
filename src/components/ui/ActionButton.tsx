import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'link' | 'success' | 'warning' | 'corporate' | 'kakao' | 'premium' | 'glass';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  badge?: string;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  description,
  onClick,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  badge,
  className,
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'relative flex flex-col h-auto p-4 space-y-2 transition-all duration-200 hover:scale-[1.02]',
        className
      )}
    >
      <div className="flex items-center space-x-2">
        <Icon className={cn(
          'transition-transform duration-200',
          loading && 'animate-spin',
          size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
        )} />
        <span className="font-medium">{label}</span>
        {badge && (
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        )}
      </div>
      {description && (
        <span className="text-xs text-muted-foreground leading-tight">
          {description}
        </span>
      )}
      {loading && (
        <div className="absolute inset-0 bg-background/50 rounded-md flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
        </div>
      )}
    </Button>
  );
};