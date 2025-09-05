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
    <section className="spacing-group">
      <h2 className="text-lg font-semibold text-foreground">빠른 통계</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 text-center">
              <div className={`inline-flex p-3 rounded-full ${stat.bgColor} mb-3`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};