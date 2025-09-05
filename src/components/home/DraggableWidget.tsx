import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { useDashboardStore, DashboardWidget } from '@/store/dashboardStore';
import { cn } from '@/lib/utils';

interface DraggableWidgetProps {
  widget: DashboardWidget;
  children: React.ReactNode;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  widget,
  children
}) => {
  const { isEditMode, toggleWidgetVisibility } = useDashboardStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!widget.isVisible && !isEditMode) {
    return null;
  }

  const getGridClasses = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-1 md:col-span-2';
      case 'large': return 'col-span-full md:col-span-2';
      case 'full': return 'col-span-full';
      default: return 'col-span-full';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative',
        getGridClasses(widget.size),
        isDragging && 'z-50 opacity-50',
        !widget.isVisible && isEditMode && 'opacity-60'
      )}
    >
      {isEditMode && (
        <Card className="absolute inset-0 z-10 bg-black/5 border-2 border-dashed border-primary/50 backdrop-blur-sm">
          <div className="flex items-center justify-between p-2 bg-white/90 rounded-t">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="cursor-grab active:cursor-grabbing p-1 h-6 w-6"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium">{widget.name}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleWidgetVisibility(widget.id)}
              className="p-1 h-6 w-6"
            >
              {widget.isVisible ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
            </Button>
          </div>
        </Card>
      )}
      
      <div className={cn(
        'transition-all duration-200',
        isEditMode && 'pointer-events-none',
        !widget.isVisible && isEditMode && 'blur-sm'
      )}>
        {children}
      </div>
    </div>
  );
};