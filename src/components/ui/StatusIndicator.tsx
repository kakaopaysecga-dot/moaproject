import React from 'react';
import { Check, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType = 'pending' | 'processing' | 'completed' | 'failed';

interface StatusIndicatorProps {
  status: StatusType;
  title?: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  title,
  description,
  className,
  size = 'md'
}) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/30',
          badgeVariant: 'secondary' as const,
          label: '대기중',
          pulseColor: 'warning'
        };
      case 'processing':
        return {
          icon: RefreshCw,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/30',
          badgeVariant: 'default' as const,
          label: '처리중',
          pulseColor: 'primary',
          animate: true
        };
      case 'completed':
        return {
          icon: Check,
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/30',
          badgeVariant: 'outline' as const,
          label: '완료',
          pulseColor: 'success'
        };
      case 'failed':
        return {
          icon: AlertCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/30',
          badgeVariant: 'destructive' as const,
          label: '실패',
          pulseColor: 'destructive'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      icon: 'h-4 w-4',
      container: 'p-2',
      text: 'text-sm',
      description: 'text-xs'
    },
    md: {
      icon: 'h-5 w-5',
      container: 'p-3',
      text: 'text-base',
      description: 'text-sm'
    },
    lg: {
      icon: 'h-6 w-6',
      container: 'p-4',
      text: 'text-lg',
      description: 'text-base'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Status icon */}
      <div className={cn(
        "rounded-full border-2 flex items-center justify-center relative",
        config.bgColor,
        config.borderColor,
        sizes.container,
        config.animate && "animate-pulse"
      )}>
        <Icon className={cn(sizes.icon, config.color, config.animate && "animate-spin")} />
        
        {/* Pulse effect for processing */}
        {config.animate && (
          <div className={cn(
            "absolute inset-0 rounded-full border-2 animate-ping",
            config.borderColor
          )} />
        )}
      </div>

      {/* Status content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("font-medium", sizes.text)}>
            {title || config.label}
          </span>
          <Badge variant={config.badgeVariant} className="text-xs">
            {config.label}
          </Badge>
        </div>
        {description && (
          <p className={cn("text-muted-foreground", sizes.description, "mt-1")}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};