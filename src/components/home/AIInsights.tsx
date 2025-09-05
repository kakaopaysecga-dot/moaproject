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
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">AI 인사이트</h2>
        <div className="grid grid-cols-2 gap-3">
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
    <section className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">AI 인사이트</h2>
        <Badge variant="secondary" className="bg-kakao-light text-kakao-dark text-xs">
          실시간
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card 
              key={insight.title} 
              className="p-4 hover:shadow-lg transition-all duration-300 animate-slide-up border-l-4 border-l-primary"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <Icon className="h-5 w-5 text-primary" />
                <Badge 
                  variant={insight.trend === 'up' ? 'default' : 'secondary'}
                  className="text-xs bg-success/10 text-success border-success/20"
                >
                  {insight.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">
                  {insight.title}
                </p>
                <p className="text-xl font-bold text-foreground">
                  {insight.value}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};