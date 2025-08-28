import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  Car, 
  Heart, 
  Camera,
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

const serviceCards: ServiceCard[] = [
  {
    title: '예약 서비스',
    description: '좌석 및 회의실 예약',
    icon: Calendar,
    path: '/booking',
    color: 'bg-corporate-blue'
  },
  {
    title: '요청 관리',
    description: '각종 업무 요청 및 처리 현황',
    icon: FileText,
    path: '/requests',
    color: 'bg-accent'
  },
  {
    title: '명함 신청',
    description: '개인 명함 제작 신청',
    icon: CreditCard,
    path: '/requests/business-card',
    color: 'bg-success'
  },
  {
    title: '주차 등록',
    description: '회사 주차장 이용 등록',
    icon: Car,
    path: '/requests/parking',
    color: 'bg-warning'
  },
  {
    title: '경조사 지원',
    description: '결혼, 장례 등 경조사 지원 신청',
    icon: Heart,
    path: '/requests/events',
    color: 'bg-destructive'
  },
  {
    title: '사무환경 개선',
    description: '사무실 환경 개선 요청',
    icon: Camera,
    path: '/requests/environment',
    color: 'bg-corporate-blue'
  }
];

export const ServiceCards: React.FC = () => {
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold px-1 flex items-center">
        <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full mr-3"></span>
        주요 서비스
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {serviceCards.map((service) => (
          <Link key={service.path} to={service.path} className="group">
            <Card className="h-full border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.96] group-hover:-translate-y-1 overflow-hidden">
              <CardContent className="p-5 text-center space-y-3">
                <div className={`mx-auto w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="h-7 w-7 text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm leading-tight">{service.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};