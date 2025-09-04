import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Users, CheckCircle } from 'lucide-react';
export const QuickStats: React.FC = () => {
  const stats = [{
    icon: CheckCircle,
    label: "오늘 완료",
    value: "3/5",
    color: "text-success",
    bgColor: "bg-success/10"
  }, {
    icon: Clock,
    label: "대기중",
    value: "2건",
    color: "text-warning",
    bgColor: "bg-warning/10"
  }, {
    icon: Users,
    label: "회의 예정",
    value: "1건",
    color: "text-primary",
    bgColor: "bg-primary/10"
  }, {
    icon: TrendingUp,
    label: "생산성",
    value: "↗ 12%",
    color: "text-accent",
    bgColor: "bg-accent/10"
  }];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="font-semibold">{stat.value}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};