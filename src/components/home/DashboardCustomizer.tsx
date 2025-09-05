import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';

export const DashboardCustomizer: React.FC = () => {
  const { widgets, toggleWidgetVisibility, resetToDefault } = useDashboardStore();

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return '작음';
      case 'medium': return '중간';
      case 'large': return '큼';
      case 'full': return '전체';
      default: return size;
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'small': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-green-100 text-green-800';
      case 'large': return 'bg-yellow-100 text-yellow-800';
      case 'full': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          대시보드 설정
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            대시보드 커스터마이징
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">위젯 표시 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {widgets
                .sort((a, b) => a.order - b.order)
                .map((widget) => (
                  <div key={widget.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {widget.isVisible ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm font-medium">{widget.name}</span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getSizeColor(widget.size)}`}
                      >
                        {getSizeLabel(widget.size)}
                      </Badge>
                    </div>
                    <Switch
                      checked={widget.isVisible}
                      onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                    />
                  </div>
                ))}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="flex-1 gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              기본값으로 복원
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};