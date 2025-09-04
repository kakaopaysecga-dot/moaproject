import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  Car, 
  Heart, 
  Thermometer,
  Settings,
  Search,
  X,
  LucideIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredFrequentServices = frequentServices.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAllServices = allServices.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasSearchResults = filteredFrequentServices.length > 0 || filteredAllServices.length > 0;

  return (
    <div className="space-y-6">
      {/* 검색 기능 */}
      <div className="flex items-center gap-2">
        {showSearch ? (
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="서비스 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSearch(false);
                setSearchTerm('');
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-semibold text-foreground">서비스</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="h-8 w-8 p-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* 검색 결과가 없을 때 */}
      {searchTerm && !hasSearchResults && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">'{searchTerm}'에 대한 검색 결과가 없습니다</p>
        </div>
      )}

      {/* 자주 사용하는 서비스 */}
      {(!searchTerm || filteredFrequentServices.length > 0) && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground px-1">
            {searchTerm ? '자주 사용하는 서비스 검색 결과' : '자주 사용하는 서비스'}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredFrequentServices.map((service, index) => (
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
      )}

      {/* 전체 서비스 */}
      {(!searchTerm || filteredAllServices.length > 0) && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground px-1">
            {searchTerm ? '전체 서비스 검색 결과' : '전체 서비스'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {filteredAllServices.map((service, index) => (
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
      )}
    </div>
  );
};