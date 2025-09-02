import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  Car, 
  Heart, 
  Thermometer,
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
    title: '주차 등록',
    description: '주차장 이용 등록',
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
          {frequentServices.map((service) => (
            <Link key={service.path} to={service.path} className="group">
              <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 min-h-[90px] group-hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-90`} />
                <CardContent className="relative p-4 flex items-center gap-3 text-white h-full">
                  <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                    <service.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">{service.title}</h4>
                    <p className="text-xs text-white/80">{service.description}</p>
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
          {allServices.map((service) => (
            <Link key={service.path} to={service.path} className="group">
              <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 min-h-[110px] group-hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-90`} />
                <CardContent className="relative p-4 text-center space-y-3 text-white h-full flex flex-col justify-center">
                  <div className="mx-auto p-2 rounded-xl bg-white/20 backdrop-blur-sm w-fit">
                    <service.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm leading-tight">{service.title}</h4>
                    <p className="text-xs text-white/80 leading-relaxed">{service.description}</p>
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