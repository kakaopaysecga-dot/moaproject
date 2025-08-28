import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Coffee, Thermometer, CreditCard, Zap } from 'lucide-react';

const quickActions = [
  {
    title: '빠른 회의실 예약',
    subtitle: 'AI 추천 회의실',
    icon: Calendar,
    link: '/booking/quick-meeting-room',
    gradient: 'from-primary/90 to-accent/90',
    badge: 'AI'
  },
  {
    title: '스마트 오피스',
    subtitle: '즉시 이용 가능',
    icon: Coffee,
    link: '/booking/quick-smart-office',
    gradient: 'from-success/90 to-success/70',
    badge: '즉시'
  },
  {
    title: '온도 조절 요청',
    subtitle: '실시간 반영',
    icon: Thermometer,
    link: '/requests/environment',
    gradient: 'from-warning/90 to-warning/70',
    badge: '실시간'
  },
  {
    title: '명함 신청',
    subtitle: '디지털 명함 포함',
    icon: CreditCard,
    link: '/requests/business-card',
    gradient: 'from-corporate-blue/90 to-corporate-blue/70',
    badge: '디지털'
  }
];

export const QuickActions: React.FC = () => {
  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">빠른 실행</h2>
        <Zap className="h-4 w-4 text-primary animate-bounce-subtle" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={action.title}
              className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Link to={action.link}>
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-primary/10 text-primary border-primary/20"
                    >
                      {action.badge}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {action.subtitle}
                    </p>
                  </div>
                </div>

                {/* Hover effect shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </Link>
            </Card>
          );
        })}
      </div>
    </section>
  );
};