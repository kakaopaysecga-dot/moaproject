import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  Car, 
  Heart, 
  Thermometer,
  Settings,
  LucideIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceCard {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
}

const frequentServices: ServiceCard[] = [
  {
    title: '온도 조절 요청',
    description: '실시간 환경 개선',
    icon: Thermometer,
    path: '/requests/environment',
    color: 'from-warning to-orange-400'
  },
  {
    title: '명함 신청',
    description: '디지털 명함 포함',
    icon: CreditCard,
    path: '/requests/business-card',
    color: 'from-success to-emerald-400'
  }
];

const allServices: ServiceCard[] = [
  {
    title: '예약 현황',
    description: '좌석 및 회의실 현황',
    icon: Calendar,
    path: '/booking',
    color: 'from-corporate-blue to-blue-400'
  },
  {
    title: '요청 관리',
    description: '요청 상태 확인',
    icon: FileText,
    path: '/requests',
    color: 'from-accent to-yellow-400'
  },
  {
    title: '사무환경 개선',
    description: '사진 첨부하여 개선 요청',
    icon: Settings,
    path: '/requests/environment',
    color: 'from-orange-500 to-orange-400'
  },
  {
    title: '주차 등록',
    description: '1일권 주차 등록',
    icon: Car,
    path: '/requests/parking',
    color: 'from-purple-500 to-purple-400'
  },
  {
    title: '경조사 지원',
    description: '결혼, 장례 등 지원 신청',
    icon: Heart,
    path: '/requests/events',
    color: 'from-pink-500 to-pink-400'
  }
];

export const ServiceCards: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 자주 사용하는 서비스 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground px-1">자주 사용하는 서비스</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {frequentServices.map((service, index) => (
            <Link key={service.path} to={service.path} className="group">
              <Card className="relative overflow-hidden border border-border/50 bg-card hover:shadow-xl transition-all duration-300 min-h-[80px] group-hover:scale-[1.02] animate-fade-in" 
                style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="relative p-4 flex items-center gap-3">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${service.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{service.title}</h4>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 전체 서비스 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground px-1">전체 서비스</h3>
        <div className="grid grid-cols-2 gap-3">
          {allServices.map((service, index) => (
            <Link key={service.path} to={service.path} className="group">
              <Card className="relative overflow-hidden border border-border/50 bg-card hover:shadow-xl transition-all duration-300 min-h-[120px] group-hover:scale-[1.02] animate-scale-in"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}>
                <CardContent className="relative p-4 text-center space-y-3 h-full flex flex-col justify-center">
                  <div className={`mx-auto p-3 rounded-2xl bg-gradient-to-br ${service.color} shadow-lg group-hover:scale-110 transition-transform duration-300 w-fit`}>
                    <service.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">{service.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};