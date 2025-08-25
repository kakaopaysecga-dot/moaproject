import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRequestsStore } from '@/store/requestsStore';

export default function RequestStatus() {
  const { requests } = useRequestsStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">대기중</Badge>;
      case 'processing':
        return <Badge variant="default">진행중</Badge>;
      case 'completed':
        return <Badge variant="outline">완료</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="py-6 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">요청 관리</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">신청한 요청의 처리 현황을 확인하세요</p>
      </div>

      <div className="space-y-6">
        {requests.length === 0 ? (
          <Card className="shadow-lg border-0">
            <CardContent className="py-12 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">아직 신청한 요청이 없습니다</h3>
                <p className="text-muted-foreground leading-relaxed">홈 화면에서 다양한 서비스를 신청해보세요</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl font-semibold leading-tight">{request.title}</CardTitle>
                  <div className="flex-shrink-0">
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground leading-relaxed">{request.content}</p>
                <p className="text-sm text-muted-foreground/80 font-medium">
                  신청일: {new Date(request.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}