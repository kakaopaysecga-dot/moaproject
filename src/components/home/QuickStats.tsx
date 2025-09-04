import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Users, CheckCircle } from 'lucide-react';

export const QuickStats: React.FC = () => {
  const stats = [
    {
      icon: CheckCircle,
      label: "오늘 완료",
      value: "3/5",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: Clock,
      label: "대기중",
      value: "2건",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      icon: Users,
      label: "회의 예정",
      value: "1건",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: TrendingUp,
      label: "생산성",
      value: "↗ 12%",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat, index) => (
        <Card key={index} className={`p-3 text-center border-0 ${stat.bgColor}`}>
          <div className="space-y-1">
            <stat.icon className={`h-4 w-4 mx-auto ${stat.color}`} />
            <div className={`text-sm font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat.label}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};