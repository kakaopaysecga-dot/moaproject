import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Users, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  className 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const quickActions = [
    {
      icon: Calendar,
      label: '빠른 예약',
      color: 'bg-primary text-primary-foreground',
      action: () => console.log('Quick booking')
    },
    {
      icon: Users,
      label: '동료 찾기',
      color: 'bg-accent text-accent-foreground',
      action: () => console.log('Find colleagues')
    },
    {
      icon: MessageSquare,
      label: '요청하기',
      color: 'bg-success text-success-foreground',
      action: () => console.log('Make request')
    }
  ];

  return (
    <div className={cn(
      "fixed bottom-24 right-4 z-40 flex flex-col-reverse items-end gap-3",
      className
    )}>
      {/* 확장된 액션 버튼들 */}
      {isExpanded && (
        <div className="flex flex-col gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              className={cn(
                "shadow-lg animate-in slide-in-from-bottom-2 duration-200",
                action.color
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={action.action}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* 메인 FAB */}
      <Button
        size="lg"
        className={cn(
          "w-14 h-14 rounded-full shadow-xl transition-all duration-300",
          "bg-gradient-to-r from-primary to-accent text-white",
          isExpanded && "rotate-45"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};