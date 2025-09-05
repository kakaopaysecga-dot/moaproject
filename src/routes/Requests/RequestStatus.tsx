import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, CreditCard, Car, Thermometer, Heart, Settings, FileImage } from 'lucide-react';
import { useRequestsStore } from '@/store/requestsStore';

export default function RequestStatus() {
  const { 
    requests, 
    isLoading, 
    error, 
    loadRequests, 
    initRealtime, 
    cleanup, 
    clearError 
  } = useRequestsStore();
  
  useEffect(() => {
    // 초기 데이터 로드
    const loadData = async () => {
      try {
        await loadRequests();
        // 데이터 로드 후 실시간 업데이트 초기화
        initRealtime();
      } catch (err) {
        console.error('Failed to load requests:', err);
      }
    };
    
    loadData();
    
    // 클린업
    return () => {
      cleanup();
    };
  }, []);

  // 페이지 포커스 시 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      loadRequests();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // 에러가 있으면 에러 처리
  useEffect(() => {
    if (error) {
      console.error('Request error:', error);
    }
  }, [error]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">처리 대기중</Badge>;
      case 'processing':
        return <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">처리 진행중</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">처리 완료</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRequestIcon = (type: string) => {
    switch (type) {
      case 'business-card':
        return <CreditCard className="h-5 w-5 text-primary" />;
      case 'parking':
        return <Car className="h-5 w-5 text-purple-500" />;
      case 'temperature':
        return <Thermometer className="h-5 w-5 text-orange-500" />;
      case 'events':
        return <Heart className="h-5 w-5 text-pink-500" />;
      case 'environment':
        return <Settings className="h-5 w-5 text-green-500" />;
      default:
        return <FileImage className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'business-card':
        return '명함 신청';
      case 'parking':
        return '주차 등록';
      case 'temperature':
        return '온도 조절';
      case 'events':
        return '경조사 지원';
      case 'environment':
        return '사무환경 개선';
      default:
        return '기타 요청';
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

      {/* 에러 메시지 - 실제 에러가 있고 로딩중이 아닐 때만 표시 */}
      {error && !isLoading && (
        <Card className="shadow-md border-0 bg-red-50 border-red-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearError}
                className="text-red-700 hover:bg-red-100"
              >
                닫기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 로딩 상태 */}
      {isLoading && requests.length === 0 && (
        <Card className="shadow-md border-0">
          <CardContent className="py-16 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">요청 목록을 불러오는 중...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 요청 목록 */}
      <div className="space-y-6">
        {!isLoading && requests.length === 0 ? (
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
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getRequestIcon(request.type)}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-lg font-semibold leading-tight">{request.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {getRequestTypeLabel(request.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        신청일: {new Date(request.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </p>
                    </div>
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