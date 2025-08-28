import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  time: string;
  status: 'completed' | 'pending' | 'scheduled';
  type: 'booking' | 'request' | 'system';
}

export const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading recent activities
    const timer = setTimeout(() => {
      setActivities([
        {
          id: '1',
          title: '회의실 B동 201호 예약 완료',
          time: '방금 전',
          status: 'completed',
          type: 'booking'
        },
        {
          id: '2',
          title: '명함 신청 승인 대기',
          time: '15분 전',
          status: 'pending',
          type: 'request'
        },
        {
          id: '3',
          title: '내일 오후 3시 회의실 예약',
          time: '1시간 전',
          status: 'scheduled',
          type: 'booking'
        },
        {
          id: '4',
          title: '실내 온도 조절 요청 완료',
          time: '2시간 전',
          status: 'completed',
          type: 'request'
        }
      ]);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'scheduled':
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">최근 활동</h2>
        <Card className="p-4">
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded mb-1"></div>
                  <div className="h-3 bg-muted rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">최근 활동</h2>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0">
                {getStatusIcon(activity.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(activity.status)}`}
                  >
                    {activity.status === 'completed' && '완료'}
                    {activity.status === 'pending' && '대기'}
                    {activity.status === 'scheduled' && '예정'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};