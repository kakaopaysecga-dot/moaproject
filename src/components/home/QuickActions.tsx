import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building2, Zap } from 'lucide-react';

const quickActions = [
  {
    title: '빠른 회의실 예약',
    subtitle: 'AI 추천 회의실',
    icon: Calendar,
    link: '/booking/quick-meeting',
    gradient: 'from-slate-600 to-slate-700',
    badge: 'AI'
  },
  {
    title: '스마트오피스 자리 예약',
    subtitle: '즉시 이용 가능',
    icon: Building2,
    link: '/booking/quick-office',
    gradient: 'from-rose-500 to-pink-600',
    badge: '즉시'
  }
];

export const QuickActions: React.FC = () => {
  return (
    <section className="spacing-items animate-fade-in">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">빠른 예약</h2>
        <Zap className="h-5 w-5 text-primary animate-bounce-subtle" />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={action.title}
              className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 min-h-[100px]"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Link to={action.link} className="block h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient}`} />
                
                <div className="relative p-5 md:p-6 h-full flex items-center text-white">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                      </div>
                      <div className="spacing-tight text-left">
                        <h3 className="font-semibold text-base md:text-lg text-white">
                          {action.title}
                        </h3>
                        <p className="text-sm md:text-base text-white/80">
                          {action.subtitle}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs md:text-sm bg-white/20 text-white border-white/30 backdrop-blur-sm shrink-0"
                    >
                      {action.badge}
                    </Badge>
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