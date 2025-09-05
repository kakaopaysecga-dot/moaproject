import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface StatusMessageProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  className?: string;
}

const statusConfig = {
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-800',
    iconClassName: 'text-blue-600',
  },
  success: {
    icon: CheckCircle,
    className: 'border-green-200 bg-green-50 text-green-800',
    iconClassName: 'text-green-600',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-orange-200 bg-orange-50 text-orange-800',
    iconClassName: 'text-orange-600',
  },
  error: {
    icon: XCircle,
    className: 'border-red-200 bg-red-50 text-red-800',
    iconClassName: 'text-red-600',
  },
};

export const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  title,
  message,
  className,
}) => {
  const config = statusConfig[type];
  const Icon = config.icon;

  return (
    <Alert className={cn(config.className, className)}>
      <Icon className={cn('h-4 w-4', config.iconClassName)} />
      <AlertDescription className="space-y-1">
        {title && <div className="font-medium">{title}</div>}
        <div>{message}</div>
      </AlertDescription>
    </Alert>
  );
};