import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { useRequestsStore } from '@/store/requestsStore';

export default function RequestStatus() {
  const { requests } = useRequestsStore();

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
        {requests.length === 0 ? (
          <Card className="shadow-md border-0">
            <CardContent className="py-16 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">📋</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">아직 신청한 요청이 없습니다</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  홈 화면에서 다양한 서비스를 신청해보세요
                </p>
              </div>
              <Link to="/">
                <Button className="mt-4">
                  홈으로 돌아가기
                </Button>
              </Link>
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