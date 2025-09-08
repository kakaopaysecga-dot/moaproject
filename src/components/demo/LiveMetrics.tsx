import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Clock, MapPin, Zap } from 'lucide-react';

interface MetricData {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  change: number;
}

export const LiveMetrics: React.FC<{ isDemo: boolean }> = ({ isDemo }) => {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      label: '업무 효율성 개선',
      value: 0,
      unit: '%',
      icon: <TrendingUp className="h-4 w-4" />,
      trend: 'up',
      change: 0
    },
    {
      label: '직원 찾기 시간 단축',
      value: 0,
      unit: '분',
      icon: <Clock className="h-4 w-4" />,
      trend: 'down',
      change: 0
    },
    {
      label: '공간 활용도',
      value: 0,
      unit: '%',
      icon: <MapPin className="h-4 w-4" />,
      trend: 'up',
      change: 0
    },
    {
      label: '실시간 사용자',
      value: 0,
      unit: '명',
      icon: <Users className="h-4 w-4" />,
      trend: 'up',
      change: 0
    }
  ]);

  useEffect(() => {
    if (!isDemo) return;

    const targets = [
      { value: 87, change: 15 },
      { value: 12, change: 8 },
      { value: 94, change: 22 },
      { value: 128, change: 35 }
    ];

    const interval = setInterval(() => {
      setMetrics(prev => 
        prev.map((metric, index) => {
          const target = targets[index];
          const increment = target.value / 50; // 50 steps to reach target
          const changeIncrement = target.change / 50;
          
          return {
            ...metric,
            value: Math.min(metric.value + increment, target.value),
            change: Math.min(metric.change + changeIncrement, target.change)
          };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isDemo]);

  if (!isDemo) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 pointer-events-none">
      <Card className="p-4 bg-background/95 backdrop-blur-lg border-primary/20 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium">AI 실시간 분석</span>
          <Badge variant="outline" className="text-xs animate-pulse">LIVE</Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {metric.icon}
                <span className="text-xs text-muted-foreground">{metric.label}</span>
              </div>
              <div className="font-bold text-lg">
                {Math.round(metric.value)}{metric.unit}
              </div>
              <div className={`text-xs flex items-center justify-center gap-1 ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`h-3 w-3 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                +{Math.round(metric.change)}{metric.unit}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};