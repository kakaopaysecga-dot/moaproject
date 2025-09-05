import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: 'default' | 'highlight' | 'success' | 'warning';
  className?: string;
}

const variantStyles = {
  default: 'bg-card/50 backdrop-blur-sm border-border/40',
  highlight: 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20',
  success: 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200',
  warning: 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200',
};

const iconVariantStyles = {
  default: 'text-primary',
  highlight: 'text-primary',
  success: 'text-emerald-600',
  warning: 'text-orange-600',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  variant = 'default',
  className,
}) => {
  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardContent className="p-4 text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Icon className={cn('h-5 w-5', iconVariantStyles[variant])} />
          <div className="text-2xl font-bold text-primary">{value}</div>
        </div>
        <div className="text-sm font-medium text-foreground">{title}</div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </CardContent>
    </Card>
  );
};