import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Clock, Zap } from 'lucide-react';

interface InsightData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}

export const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate AI-powered insights
  useEffect(() => {
    const timer = setTimeout(() => {
      setInsights([
        {
          title: '오늘의 회의실 사용률',
          value: '78%',
          change: '+12%',
          trend: 'up',
          icon: Users
        },
        {
          title: '평균 응답 시간',
          value: '2.3분',
          change: '-0.8분',
          trend: 'up',
          icon: Clock
        },
        {
          title: '서비스 활용도',
          value: '94%',
          change: '+5%',
          trend: 'up',
          icon: TrendingUp
        },
        {
          title: 'AI 추천 정확도',
          value: '91%',
          change: '+3%',
          trend: 'up',
          icon: Zap
        }
      ]);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="spacing-group">
        <h2 className="text-lg font-semibold text-foreground">AI 인사이트</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded mb-1"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="spacing-group animate-fade-in">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">AI 인사이트</h2>
        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
          실시간
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card 
              key={insight.title} 
              className="p-4 hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center space-y-3">
                <div className="inline-flex p-3 rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">
                    {insight.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {insight.title}
                  </div>
                  <Badge 
                    variant="outline"
                    className="text-xs bg-success/10 text-success border-success/20"
                  >
                    {insight.change}
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};