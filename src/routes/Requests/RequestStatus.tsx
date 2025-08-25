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
    <div className="py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">요청 관리</h1>
        <p className="text-muted-foreground">신청한 요청의 처리 현황을 확인하세요</p>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">아직 신청한 요청이 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{request.title}</CardTitle>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{request.content}</p>
                <p className="text-xs text-muted-foreground">
                  신청일: {new Date(request.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}