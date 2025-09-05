import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { useRequestsStore } from '@/store/requestsStore';

export default function RequestStatus() {
  const { requests, isLoading, error, loadRequests } = useRequestsStore();

  useEffect(() => {
    console.log('RequestStatus: Loading requests...');
    loadRequests();
  }, [loadRequests]);

  console.log('RequestStatus render:', { 
    requestsCount: requests.length, 
    isLoading, 
    error,
    requests: requests.slice(0, 2) // 처음 2개만 로그
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">처리 대기중</Badge>;
      case 'processing':
        return <Badge variant="default">처리 진행중</Badge>;
      case 'completed':
        return <Badge variant="outline">처리 완료</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="py-6 space-y-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 px-2">
        <Link to="/">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-muted/50">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">나의 요청 현황</h1>
          <p className="text-muted-foreground text-sm mt-1">
            신청하신 요청의 처리 현황을 확인하세요
          </p>
        </div>
      </div>

      {/* 요청 목록 */}
      <div className="space-y-6">
        {error && (
          <Card className="shadow-md border-0 border-l-4 border-l-red-500">
            <CardContent className="py-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}
        
        {isLoading ? (
          <Card className="shadow-md border-0">
            <CardContent className="py-16 text-center">
              <div className="animate-spin mx-auto w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-muted-foreground">요청을 불러오는 중...</p>
            </CardContent>
          </Card>
        ) : requests.length === 0 ? (
          <Card className="shadow-md border-0">
            <CardContent className="py-16 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">📋</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">아직 신청한 요청이 없습니다</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  자주 사용하는 서비스를 바로 신청해보세요
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <Link to="/requests/business-card">
                    <Button variant="outline" className="w-full h-12 text-sm flex items-center gap-2">
                      <span>💳</span>
                      명함 신청
                    </Button>
                  </Link>
                  <Link to="/requests/environment">
                    <Button variant="outline" className="w-full h-12 text-sm flex items-center gap-2">
                      <span>🌡️</span>
                      온도 조절
                    </Button>
                  </Link>
                  <Link to="/requests/parking">
                    <Button variant="outline" className="w-full h-12 text-sm flex items-center gap-2">
                      <span>🚗</span>
                      주차 등록
                    </Button>
                  </Link>
                  <Link to="/booking">
                    <Button variant="outline" className="w-full h-12 text-sm flex items-center gap-2">
                      <span>📅</span>
                      예약 현황
                    </Button>
                  </Link>
                </div>
                
                <Link to="/">
                  <Button className="mt-4">
                    홈으로 돌아가기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="shadow-md border-0 hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold leading-tight">{request.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      신청일: {new Date(request.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground leading-relaxed">{request.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 하단 여백 */}
      <div className="h-6" />
    </div>
  );
}