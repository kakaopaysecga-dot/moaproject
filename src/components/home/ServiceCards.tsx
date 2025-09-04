import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, CreditCard, Car, Heart, Thermometer, Settings, Search, X, ChevronRight, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
interface ServiceCard {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
}
const frequentServices: ServiceCard[] = [{
  title: '회의실 예약',
  description: '즉시 예약 가능',
  icon: Calendar,
  path: '/booking',
  color: 'from-corporate-blue to-blue-400'
}, {
  title: '온도 조절 요청',
  description: '실시간 환경 개선',
  icon: Thermometer,
  path: '/requests/environment',
  color: 'from-warning to-orange-400'
}];
const allServices: ServiceCard[] = [{
  title: '예약 현황',
  description: '좌석 및 회의실 현황',
  icon: Calendar,
  path: '/booking',
  color: 'from-corporate-blue to-blue-400'
}, {
  title: '요청 관리',
  description: '요청 상태 확인',
  icon: FileText,
  path: '/requests',
  color: 'from-accent to-yellow-400'
}, {
  title: '명함 신청',
  description: '개인 명함 제작',
  icon: CreditCard,
  path: '/requests/business-card',
  color: 'from-success to-emerald-400'
}, {
  title: '사무환경 개선',
  description: '사진 첨부하여 개선 요청',
  icon: Settings,
  path: '/requests/environment',
  color: 'from-orange-500 to-orange-400'
}, {
  title: '주차 등록',
  description: '1일권 주차 등록',
  icon: Car,
  path: '/requests/parking',
  color: 'from-purple-500 to-purple-400'
}, {
  title: '경조사 지원',
  description: '결혼, 장례 등 지원 신청',
  icon: Heart,
  path: '/requests/events',
  color: 'from-pink-500 to-pink-400'
}];
export const ServiceCards: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const filteredFrequentServices = frequentServices.filter(service => service.title.toLowerCase().includes(searchTerm.toLowerCase()) || service.description.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredAllServices = allServices.filter(service => service.title.toLowerCase().includes(searchTerm.toLowerCase()) || service.description.toLowerCase().includes(searchTerm.toLowerCase()));
  const hasSearchResults = filteredFrequentServices.length > 0 || filteredAllServices.length > 0;
  return <div className="spacing-content">
      {/* 검색 기능 */}
      

      {/* 검색 결과가 없을 때 */}
      {searchTerm && !hasSearchResults && <div className="text-center py-8">
          <p className="text-base text-muted-foreground">'{searchTerm}'에 대한 검색 결과가 없습니다</p>
        </div>}

      {/* 자주 사용하는 서비스 - 모바일 캐러셀 */}
      {(!searchTerm || filteredFrequentServices.length > 0) && <section className="spacing-items">
          <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {searchTerm ? '자주 사용하는 서비스 검색 결과' : '자주 사용하는 서비스'}
          </h3>
            {!searchTerm && filteredFrequentServices.length > 1 && <div className="text-sm text-muted-foreground hidden sm:block">
                스와이프하여 더 보기
              </div>}
          </div>
          
          {/* 데스크톱: 그리드, 모바일: 캐러셀 */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filteredFrequentServices.map((service, index) => <ServiceCard key={service.path} service={service} index={index} />)}
            </div>
          </div>
          
          <div className="sm:hidden">
            <Carousel opts={{
          align: "start",
          dragFree: true,
          containScroll: "trimSnaps"
        }} className="w-full">
              <CarouselContent className="-ml-3">
                {filteredFrequentServices.map((service, index) => <CarouselItem key={service.path} className="pl-3 basis-4/5">
                    <ServiceCard service={service} index={index} isMobile />
                  </CarouselItem>)}
              </CarouselContent>
            </Carousel>
          </div>
        </section>}

      {/* 전체 서비스 - 모바일 최적화 그리드 */}
      {(!searchTerm || filteredAllServices.length > 0) && <section className="spacing-items">
          <h3 className="text-lg font-semibold text-foreground">
            {searchTerm ? '전체 서비스 검색 결과' : '전체 서비스'}
          </h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {filteredAllServices.map((service, index) => <Link key={service.path} to={service.path} className="group">
                <Card className="relative overflow-hidden border border-border/50 bg-card hover:shadow-xl transition-all duration-300 min-h-[120px] md:min-h-[140px] group-hover:scale-[1.02] animate-scale-in touch-manipulation" style={{
            animationDelay: `${(index + 2) * 100}ms`
          }}>
                  <CardContent className="relative p-3 md:p-4 text-center space-y-2 md:space-y-3 h-full flex flex-col justify-center">
                    <div className={`mx-auto p-2.5 md:p-3 rounded-2xl bg-gradient-to-br ${service.color} shadow-lg group-hover:scale-110 transition-transform duration-300 w-fit`}>
                      <service.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm md:text-base leading-tight text-foreground group-hover:text-primary transition-colors">{service.title}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                    <ChevronRight className="absolute top-2 right-2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </CardContent>
                </Card>
              </Link>)}
          </div>
        </section>}
    </div>;
};

// 개별 서비스 카드 컴포넌트
const ServiceCard: React.FC<{
  service: ServiceCard;
  index: number;
  isMobile?: boolean;
}> = ({
  service,
  index,
  isMobile = false
}) => <Link to={service.path} className="group">
    <Card className={`relative overflow-hidden border border-border/50 bg-card hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] animate-fade-in touch-manipulation ${isMobile ? 'min-h-[90px]' : 'min-h-[80px]'}`} style={{
    animationDelay: `${index * 100}ms`
  }}>
      <CardContent className={`relative flex items-center gap-3 ${isMobile ? 'p-4' : 'p-4'}`}>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${service.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <service.icon className="h-5 w-5 text-white" />
        </div>
        <div className="spacing-tight flex-1">
          <h4 className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors">{service.title}</h4>
          <p className="text-sm md:text-base text-muted-foreground">{service.description}</p>
        </div>
        {isMobile && <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />}
      </CardContent>
    </Card>
  </Link>;